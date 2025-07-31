// Declare our API on the global window object
export interface Device {
  id: string
  type: 'device' | 'fastboot' | string
  model?: string
}

export interface DeviceDetails {
  model: string
  manufacturer: string
  androidVersion: string
  sdkVersion: string
  batteryLevel?: number
}

export type AdbRebootMode = 'system' | 'bootloader' | 'recovery' | 'fastboot'
export type FastbootRebootMode = 'system' | 'bootloader' | 'recovery' | 'fastboot'

export interface ICustomAPI {
  getAdbVersion: () => Promise<string>
  getDevices: () => Promise<Device[]>
  rebootDevice: (deviceId: string, mode: AdbRebootMode) => Promise<void>
  getFastbootDevices: () => Promise<Device[]>
  rebootFastbootDevice: (deviceId: string, mode: FastbootRebootMode) => Promise<void>
}

declare global {
  interface Window {
    api: ICustomAPI
  }
}
