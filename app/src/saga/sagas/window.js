import { ipcRenderer } from "electron"
import { electronStore } from '../../config/persistConfig'

export function* windowMax() {
    ipcRenderer.send('maximize-window')
}

export function* windowMin() {
    ipcRenderer.send('unmaximize-window')
}

export function* resetStore () {
    electronStore.clear()
}