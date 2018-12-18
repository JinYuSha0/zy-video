import React from 'react'
import  { put, call } from 'redux-saga/effects'
import { store,  connectSocket } from '../../index'
import { ipcRenderer } from "electron"
import { sLogin, sGetCurrentUser } from "../../service"
import { Modal, Input, message } from 'antd'
import crypto from 'crypto'
import { cGetVideo } from '../../redux/reducers/dataSource'
import { electronStore } from '../../config/persistConfig'
import {
    cLoginSuccess,
    cLogoutSuccess,
    cOpenLockSuccess,
    cCloseLockSuccess,
    cGetCurrentUserSuccess,
    cOpenControllerSuccess,
    cCloseControllerSuccess, cLogout,
} from '../../redux/reducers/user'
import { jump, getInput, getMachineCode } from '../../util/util'

const confirm = Modal.confirm

export function* login ({ payload }) {
    const { windowName, channel, params } = payload
    const machineCode = yield getMachineCode()
    try {
        const result = yield call(sLogin, { ...params, 'machine_code': machineCode })
        if(result.status === 'success') {
            ipcRenderer.send('close-window', windowName)
            yield put(cLoginSuccess(result.data))
            yield put(cGetVideo({active: true}))
            connectSocket(true)
        } else {
            ipcRenderer.send('return-message', windowName, channel, result.message)
        }
    } catch (e) {
        ipcRenderer.send('return-message', windowName, channel, e.message)
    }
}

export function* logout({ payload }) {
    yield put(cLogoutSuccess())
    electronStore.clear()

    if(!!window._socket && window._socket.connected && !!window._socket.disconnect) {
        window._socket.disconnect()
    }

    if(!!payload) {
        const { title, content } = payload
        jump('/')
        if(!!title) {
            Modal.warning({
                title: title,
                content: content,
                okText: '知道了',
            })
        }
    }
}

export function* getCurrentUser() {
    try {
        const result = yield call(sGetCurrentUser)
        if(result.status === 'success') {
            yield put(cGetCurrentUserSuccess({...result.userInfo}))
        }
    } catch (e) {

    }
}

export function* openLock () {
    getInput('是否要开启操作锁?', '请输入操作密码', 'password', (pass) => {
        const md5 = crypto.createHash('md5')
        md5.update(pass)
        const str = md5.digest('hex')
        store.dispatch(cOpenLockSuccess(str))
        message.success('开启操作锁成功.')
    })
}

export function* closeLock () {
    let inputTmp = ''
    confirm({
        title: '是否要关闭操作锁?若忘记密码重新登陆即可.',
        content: <Input onChange={e => inputTmp = e.target.value} placeholder="请输入操作密码" type="password"/>,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
            return new Promise((resolve, reject) => {
                const { user } = store.getState()
                const md5 = crypto.createHash('md5')
                md5.update(inputTmp)
                const str = md5.digest('hex')

                if(user.get('lockPass') === str) {
                    store.dispatch(cCloseLockSuccess())
                    message.success('关闭操作锁成功.')
                    resolve()
                } else {
                    message.error('操作密码错误!')
                    reject()
                }
            })
        }
    })
}

export function* openController() {
    const { user } = store.getState(),
        isLock = user.get('lock')

    if(isLock) {
        let inputTmp = ''
        confirm({
            title: '请输入操作密码',
            content: <Input onChange={e => inputTmp = e.target.value} placeholder="请输入操作密码" type="password"/>,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                return new Promise((resolve, reject) => {
                    const { user } = store.getState()
                    const md5 = crypto.createHash('md5')
                    md5.update(inputTmp)
                    const str = md5.digest('hex')

                    if(user.get('lockPass') === str) {
                        store.dispatch(cOpenControllerSuccess())
                        message.success('开启播放控制成功!')
                        resolve()
                    } else {
                        message.error('操作密码错误!')
                        reject()
                    }
                })
            }
        })
    } else {
        getInput('请先开启操作锁', '请输入操作密码', 'password', (pass) => {
            const md5 = crypto.createHash('md5')
            md5.update(pass)
            const str = md5.digest('hex')
            store.dispatch(cOpenLockSuccess(str))
            store.dispatch(cOpenControllerSuccess())
            message.success('开启播放控制成功!')
        })
    }
}

export function* closeController () {
    yield put(cCloseControllerSuccess())
}