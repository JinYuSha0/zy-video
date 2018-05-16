import { ipcRenderer } from "electron"

export function* windowMax() {
    ipcRenderer.send('maximize-window')
}

export function* windowMin() {
    ipcRenderer.send('unmaximize-window')
}