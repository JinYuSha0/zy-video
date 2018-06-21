const { app, BrowserWindow, ipcMain, clipboard } = require('electron')
const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')

const DEV = !!process.env.NODE_ENV
DEV ? require('electron-reload')(__dirname) : null

let mainWindow

const randomString = () =>
    Math.random()
        .toString(36)
        .substring(7)
        .split('')
        .join('.')

const update = (url) => {
    if(DEV) return

    const randomName = randomString()
    const appPath = path.resolve(app.getAppPath())
    const downloadPath = path.resolve(appPath, `../app.${randomName}`)
    const tmpPath = path.resolve(app.getPath('temp'), randomName)
    const updaterPath = path.resolve(appPath, '../updater.exe')
    const exePath = path.resolve(appPath, '../../zy-video.exe')

    http.get(url, (res) => {
        const file = fs.createWriteStream(tmpPath)

        res.on('data', (chunk) => {
            file.write(chunk)
        })

        res.on('end', () => {
            file.end()
            fs.accessSync(tmpPath, fs.constants.R_OK)
            fs.writeFileSync(downloadPath, fs.readFileSync(tmpPath))
            fs.unlinkSync(tmpPath)

            //运行更新助手(旧版asar的位置、新版asar的位置、程序的位置)
            app.relaunch({
                args: [appPath, downloadPath, exePath],
                execPath: updaterPath
            })
            app.exit(0)
        })
    })
}

const createWindow = () => {
    let otherWindow = {}
    mainWindow = new BrowserWindow({show: false, width: 1235, height: 832, minWidth: 1022, minHeight: 670, frame: false, backgroundColor: '#F6F6F6'})

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    mainWindow.on('maximize', () => {
        mainWindow.send('message', null, 'maximize')
    })

    mainWindow.on('unmaximize', () => {
        mainWindow.send('message', null, 'unmaximize')
    })

    //下载事件
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        //文件总大小
        const totalBytes = item.getTotalBytes()

        //文件保存路径
        const savePath = path.join(__dirname, `../../${item.getFilename()}`)

        //设置保存路径
        item.setSavePath(savePath)

        item.on('updated', (event, state) => {
            switch (state) {
                case 'interrupted':
                    console.log('下载中断无法恢复下载')
                    break
                case 'progressing':
                    if(item.isPaused()) {
                        console.log('下载暂停')
                    } else {
                        console.log(item.getReceivedBytes() / totalBytes)
                    }
                    break
            }
        })

        item.once('done', (event, state) => {
            if (state === 'completed') {
                app.dock.downloadFinished(savePath)
                console.log('下载完成')
            } else {
                console.log(`下载失败: ${state}`)
            }
        })
    })

    //显示
    ipcMain.on('show-window', () => {
        mainWindow.show()
    })

    //最小化
    ipcMain.on('minimize-window', () => {
        mainWindow.minimize()
    })

    //最大化
    ipcMain.on('maximize-window', () => {
        mainWindow.maximize()
    })

    //最大化还原
    ipcMain.on('unmaximize-window', () => {
        mainWindow.unmaximize()
    })

    //退出
    ipcMain.on('close-all-window', () => {
        app.quit()
    })

    //打开窗口
    ipcMain.on('open-window', (event, name, option) => {
        if(!!otherWindow[name]) {
            otherWindow[name].show()
            return
        }

        let newWindow = new BrowserWindow(Object.assign({show: false}, option))
        otherWindow[name] = newWindow
        newWindow.loadURL(url.format({
            pathname: path.join(__dirname, './extra/' + name + '/' + name + '.html'),
            protocol: 'file:',
            slashes: true
        }))
        newWindow.once('ready-to-show', () => {
            newWindow.show()
        })
        newWindow.on('close', () => {
            otherWindow[name] = null
        })
    })

    //关闭窗口
    ipcMain.on('close-window', (event, name) => {
        otherWindow[name].close()
        otherWindow[name] = null
    })

    //子窗口向主窗口通讯
    ipcMain.on('message', (event, windowName, channel, params) => {
        mainWindow.send('message', windowName, channel, params)
    })

    //主窗口向子窗口通讯
    ipcMain.on('return-message', (event, windowName, channel, params) => {
        if(!otherWindow[windowName]) return
        otherWindow[windowName].send('message', channel, params)
    })

    //更新asar
    ipcMain.on('update', (event, url) => {
        update(url)
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
})
