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

import Header from './components/header/header'

import PageIndex from './page/index/index'
import PagePlayer from './page/player/player'

import { cLogin } from './redux/reducers/user'
import { cWindowMax, cWindowMin } from './redux/reducers/window'

const root = document.getElementById('app')
export const socket = io('http://test.yourhr.com.cn', { path: '/ws', forceNew: true })
export const history = createHistory()
export const { store, persistor } = createStore(rootReducer, rootSaga, () => {
    ipcRenderer.send('show-window')
    ipcRenderer.on('message', (e, windowName, channel, params) => {
        windowEvent.emit(channel, windowName, channel, params)
    })
    render(<App/>, root)
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

socket.on('hello', data => {
    console.log(data)
})