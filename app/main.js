const { app, BrowserWindow, ipcMain, net } = require('electron')
const path = require('path')
const url = require('url')

const DEV = !!process.env.NODE_ENV
DEV ? require('electron-reload')(__dirname) : null

let mainWindow

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
