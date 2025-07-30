import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { DeviceDetailsPanel } from './components/DeviceDetailsPanel'
import type { Device, DeviceDetails } from './types'

const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
    <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
  </svg>
)

const DeviceListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
)

function App(): JSX.Element {
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDeviceDetails, setSelectedDeviceDetails] = useState<DeviceDetails | null>(null)

  const fetchDevices = () => {
    setIsLoading(true)
    setSelectedDeviceDetails(null) // Reset detail saat refresh

    window.api
      .getDevices()
      .then((fetchedDevices) => {
        setDevices(fetchedDevices)
        if (fetchedDevices.length > 0 && fetchedDevices[0]) {
          window.api.getDeviceDetails(fetchedDevices[0].id).then((details) => {
            setSelectedDeviceDetails(details)
          })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Connected Devices</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              ADB Status:{' '}
              <span className={devices.length > 0 ? 'text-green-400' : 'text-red-400'}>
                {devices.length > 0 ? 'Connected' : 'Disconnected'}
              </span>
            </span>
            <button
              onClick={fetchDevices}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors disabled:bg-gray-500"
              disabled={isLoading}
            >
              <RefreshIcon />
              {isLoading ? 'Refreshing...' : 'Refresh Devices'}
            </button>
          </div>
        </header>

        {/* Layout utama */}
        <main className="flex-1 p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Device List</h3>
            <div className="space-y-4">
              {isLoading ? (
                <p>Loading devices...</p>
              ) : devices.length > 0 ? (
                devices.map((device) => (
                  <div
                    key={device.id}
                    className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-transparent hover:border-blue-500 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-green-400">
                        <DeviceListIcon />
                      </div>
                      <div>
                        <p className="font-semibold">{device.model}</p>
                        <p className="text-sm text-gray-400">{device.id}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold uppercase bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      {device.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">No devices found.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Please connect a device and enable USB Debugging.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Device Details</h3>
            <DeviceDetailsPanel details={selectedDeviceDetails} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
