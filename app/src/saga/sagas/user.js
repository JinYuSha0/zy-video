import React from 'react'
import  { put } from 'redux-saga/effects'
import { ipcRenderer } from "electron"
import { sLogin } from "../../service"
import { store } from '../../index'
import { Modal, Input, message } from 'antd'
import crypto from 'crypto'
import { cLoginSuccess, cLogoutSuccess, cOpenLockSuccess, cCloseLockSuccess } from '../../redux/reducers/user'

const confirm = Modal.confirm

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

export function* openLock () {
    confirm({
        title: '是否要开启操作锁?',
        content: <Input onChange={e => window.tmp = e.target.value} placeholder="请输入操作密码" type="password"/>,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
            return new Promise((resolve, reject) => {
                if(!!window.tmp && window.tmp.length > 0) {
                    const md5 = crypto.createHash('md5')
                    md5.update(window.tmp)
                    window.tmp = null
                    const str = md5.digest('hex')
                    store.dispatch(cOpenLockSuccess(str))
                    message.success('开启操作锁成功.')
                    resolve()
                } else {
                    message.error('操作密码不能为空!')
                    reject()
                }
            })
        }
    })
}

export function* closeLock () {
    confirm({
        title: '是否要关闭操作锁?若忘记密码重新登陆即可.',
        content: <Input onChange={e => window.tmp = e.target.value} placeholder="请输入操作密码" type="password"/>,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
            return new Promise((resolve, reject) => {
                const { user } = store.getState()
                const md5 = crypto.createHash('md5')
                md5.update(!!window.tmp ? window.tmp : '')
                window.tmp = null
                const str = md5.digest('hex')

                if(str === null || user.get('lockPass') === str) {
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