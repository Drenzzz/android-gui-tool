// Declare our API on the global window object
export interface Device {
  id: string
  type: string
  model?: string
}

export interface DeviceDetails {
  model: string
  manufacturer: string
  androidVersion: string
  sdkVersion: string
  batteryLevel?: number
}

export type RebootMode = 'system' | 'bootloader' | 'recovery' | 'fastboot'

export interface ICustomAPI {
  getAdbVersion: () => Promise<string>
  getDevices: () => Promise<Device[]>
  rebootDevice: (deviceId: string, mode: RebootMode) => Promise<void>
}

declare global {
  interface Window {
    api: ICustomAPI
  }
}
