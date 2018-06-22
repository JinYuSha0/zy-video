const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('fs')
const path = require('path')
const url = require('url')
const os = require('os')
const http = require('http')

const DEV = !!process.env.NODE_ENV
DEV ? require('electron-reload')(__dirname) : null

let mainWindow
let otherWindow = {}

const randomString = () =>
    Math.random()
        .toString(36)
        .substring(7)
        .split('')
        .join('.')

const update = (url) => {
    const isUrl = /^https?:\/\//.test(url)
    const isWin = os.platform().toLowerCase().indexOf('win') >= 0

    if(!isWin) {
        dialog.showMessageBox(otherWindow['update'], {
            title: 'window之外的系统暂不支持更新',
            message: `os:${os.platform()}`
        }, () => {
            otherWindow['update'].close()
        })
        return
    }

    if(!isUrl) {
        dialog.showMessageBox(otherWindow['update'], {
            title: '更新资源路径无效',
            message: `uri:${url}`
        }, () => {
            otherWindow['update'].close()
        })
        return
    }

    const randomName = randomString()
    const appPath = path.resolve(app.getAppPath())
    const downloadPath = path.resolve(appPath, `../app.${randomName}`)
    const tmpPath = path.resolve(app.getPath('temp'), randomName)
    const updaterPath = path.resolve(appPath, '../updater.exe')
    const exePath = path.resolve(appPath, '../../zy-video.exe')

    http.get(url, (res) => {
        const file = fs.createWriteStream(tmpPath)
        const totalBytes= res.headers['content-length']
        let currentBytes = 0

        res.on('data', (chunk) => {
            currentBytes += chunk.length
            otherWindow['update'].send('progress', parseInt(currentBytes / totalBytes * 100))
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
    }).on('error', (err) => {
        dialog.showMessageBox(otherWindow['update'], {
            title: '下载更新资源失败',
            message: `uri:${url}, message:` + err.message
        }, () => {
            otherWindow['update'].close()
        })
    })


}

const createWindow = () => {
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
        if(!otherWindow[name]) return
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

    //显示提示
    ipcMain.on('show-message', (event, windowName, options) => {
        let window
        if(!windowName) {
            window = mainWindow
        } else {
            window = otherWindow[windowName]
        }
        dialog.showMessageBox(window, options)
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
