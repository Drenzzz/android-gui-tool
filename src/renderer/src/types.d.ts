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

export interface ICustomAPI {
  getAdbVersion: () => Promise<string>
  getDevices: () => Promise<Device[]>
}

declare global {
  interface Window {
    api: ICustomAPI
  }
}
