// Declare our API on the global window object
export interface ICustomAPI {
  getAdbVersion: () => Promise<string>
}

declare global {
  interface Window {
    api: ICustomAPI
  }
}
