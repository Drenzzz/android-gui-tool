import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getAdbVersion: (): Promise<string> => ipcRenderer.invoke('get-adb-version'),
  getDevices: (): Promise<any[]> => ipcRenderer.invoke('get-devices'),
  getDeviceDetails: (deviceId: string): Promise<any> => ipcRenderer.invoke('get-device-details', deviceId),
  rebootDevice: (deviceId: string, mode: any): Promise<void> => ipcRenderer.invoke('reboot-device', deviceId, mode)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
