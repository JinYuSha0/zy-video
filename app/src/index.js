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
//import { login } from './service/index'

import Header from './components/header/header'

import PageIndex from './page/index/index'
import PageLogin from './page/login/login'

const event = new EventEmitter()
event.on('login', async (windowName, channel, params) => {
    /*const result = login(params)
    if(result) {
        ipcRenderer.send('close-window', windowName)
    } else {
        ipcRenderer.send('return-message', windowName, channel, params)
    }*/
})

const root = document.getElementById('app')
export const history = createHistory()
export const { store, persistor } = createStore(rootReducer, rootSaga, () => {
    ipcRenderer.send('show-window')
    ipcRenderer.on('message', (e, windowName, channel, params) => {
        event.emit(channel, windowName, channel, params)
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
                                <Route path="/login" component={PageLogin}/>
                            </Switch>
                        </div>

                    </div>
                </ConnectedRouter>
            </Provider>
        )
    }
}