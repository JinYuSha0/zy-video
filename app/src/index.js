import './index.less'

import React, { Component } from 'react'
import { render } from 'react-dom'
import createStore from './redux/createStore'
import rootReducer from './redux/rootReducer'
import rootSaga from './saga/rootSaga'
import createHistory from 'history/createHashHistory'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Switch } from 'react-router-dom'
import { ipcRenderer } from 'electron'
import EventEmitter from 'events'
import io from 'socket.io-client'
import { version } from '../package'

import Header from './components/header/header'
import PageIndex from './page/index/index'
import PagePlayer from './page/player/player'

import { cLogin, cGetCurrentUser } from './redux/reducers/user'
import { cWindowMax, cWindowMin, cConnectFailure } from './redux/reducers/window'

const root = document.getElementById('app')
export const history = createHistory()

const autoUpdate = async () => {
    /***
     * version      最新版本
     * force        是否强制更新
     * description  描述
     * url          下载地址
     */
    const data = {
        version: '1.0.2',
        force: true,
        description: ['修复部分显示问题', '直播中断继续播放'],
        uri: 'http://static.gelantang.com/zy-video/app-1.0.0.zip',
    }

    if(version !== data.version) {
        const { UPDATE, update_options } = require('../extra/update/update')
        //ipcRenderer.send('open-window', UPDATE, update_options)
        ipcRenderer.send('update', data.uri)
    }
}

export const connectSocket = (active) => {
    if(!!window._socket && window._socket.connected) return

    const { user } = store.getState()

    if(active) {
        const socket = io('http://s.yourhr.com.cn', {
            path: '/ws',
            forceNew: true,
            query: {
                loginId: unescape(user.get('loginId')),
                token: user.get('token')
            }
        })

        socket.connect()

        socket.on('disconnect', () => {
            store.dispatch(cConnectFailure())
        })

        socket.on('action', (data, callback) => {
            switch (data.type) {
                case 'WHAT_ARE_YOU_DOING':
                    let info = {
                        isPlay: history.location.pathname === '/player',
                        playlist: store.getState().playlist.toJS()
                    }
                    callback(info)
                    break
                default:
                    store.dispatch(data)
            }
        })

        window._socket = socket
    }
}

export const { store, persistor } = createStore(rootReducer, rootSaga, () => {
    const { user } = store.getState()
    if(user.get('isLogin')) {
        connectSocket(true)
        store.dispatch(cGetCurrentUser())
    }
    ipcRenderer.send('show-window')
    ipcRenderer.on('message', (e, windowName, channel, params) => {
        windowEvent.emit(channel, windowName, channel, params)
    })
    render(<App/>, root)

    setTimeout(() => {
        autoUpdate()
    }, 0)
})

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <div className="layout">
                        <Header/>

                        <div className="layoutContent">
                            <Switch>
                                <Route exact path="/" component={PageIndex}/>
                                <Route path="/player" component={PagePlayer}/>
                            </Switch>
                        </div>

                    </div>
                </ConnectedRouter>
            </Provider>
        )
    }
}

const windowEvent = new EventEmitter()
windowEvent.on('login', (windowName, channel, params) => {
    store.dispatch(cLogin({ windowName, channel, params }))
})
windowEvent.on('maximize', () => {
    store.dispatch(cWindowMax())
})
windowEvent.on('unmaximize', () => {
    store.dispatch(cWindowMin())
})