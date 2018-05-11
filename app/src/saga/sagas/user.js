import  { put } from 'redux-saga/effects'
import { ipcRenderer } from "electron"
import { sLogin } from "../../service"
import { cLoginSuccess, cLogoutSuccess } from '../../redux/reducers/user'

export function* login ({ payload }) {
    const { windowName, channel, params } = payload
    try {
        const result = yield sLogin(params)
        if(result.status === 'success') {
            ipcRenderer.send('close-window', windowName)

            //todo
            yield put(cLoginSuccess(Object.assign(result.data, {
                userInfo: {
                    level: 1,
                    nickName: '邵瑾瑜'
                }
            })))
        } else {
            ipcRenderer.send('return-message', windowName, channel, result.message)
        }
    } catch (e) {
        ipcRenderer.send('return-message', windowName, channel, e.message)
    }
}

export function* logout() {
    yield put(cLogoutSuccess())
}