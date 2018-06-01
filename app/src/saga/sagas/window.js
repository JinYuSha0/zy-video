import { ipcRenderer } from "electron"
import { Modal } from 'antd'

export function* windowMax() {
    ipcRenderer.send('maximize-window')
}

export function* windowMin() {
    ipcRenderer.send('unmaximize-window')
}

export function* notice ({ payload }) {
    Modal.info({
        title: '管理员通知',
        content: payload,
        okText: '知道了'
    })
}