import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { DeviceDetailsPanel } from './components/DeviceDetailsPanel'
import type { Device, DeviceDetails } from './types'
import { RebootControls } from './components/RebootControls'
import { FastbootRebootControls } from './components/FastbootRebootControls'

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

function App(): React.JSX.Element {
  const [allDevices, setAllDevices] = useState<Device[]>([])
  const [isLoadingDevices, setIsLoadingDevices] = useState(true)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [selectedDeviceDetails, setSelectedDeviceDetails] = useState<DeviceDetails | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  const handleSelectDevice = (deviceId: string) => {
    if (deviceId === selectedDeviceId) return
    setSelectedDeviceId(deviceId)
    setSelectedDeviceDetails(null)

    const device = allDevices.find((d) => d.id === deviceId)
    if (device && device.type === 'device') {
      setIsLoadingDetails(true)
      window.api.getDeviceDetails(deviceId).then((details) => {
        setSelectedDeviceDetails(details)
        setIsLoadingDetails(false)
      })
    }
  }

  const fetchDevices = () => {
    setIsLoadingDevices(true)
    setSelectedDeviceId(null)
    setSelectedDeviceDetails(null)

    Promise.all([window.api.getDevices(), window.api.getFastbootDevices()])
      .then(([adbDevices, fastbootDevices]) => {
        const combinedDevices = [...adbDevices, ...fastbootDevices]
        setAllDevices(combinedDevices)
        if (combinedDevices.length > 0 && combinedDevices[0]) {
          handleSelectDevice(combinedDevices[0].id)
        }
      })
      .finally(() => {
        setIsLoadingDevices(false)
      })
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  const selectedDevice = allDevices.find((d) => d.id === selectedDeviceId)

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Device Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              ADB Status:{' '}
              <span className={allDevices.length > 0 ? 'text-green-400' : 'text-red-400'}>
                {allDevices.length > 0 ? 'Connected' : 'Disconnected'}
              </span>
            </span>
            <button onClick={fetchDevices} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors disabled:bg-gray-500" disabled={isLoadingDevices}>
              <RefreshIcon />
              {isLoadingDevices ? 'Refreshing...' : 'Refresh Devices'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Device List</h3>
            <div className="space-y-2">
              {isLoadingDevices ? (
                <p>Loading devices...</p>
              ) : allDevices.length > 0 ? (
                allDevices.map((device) => (
                  <div
                    key={device.id}
                    onClick={() => handleSelectDevice(device.id)}
                    className={`p-4 rounded-lg flex justify-between items-center border transition-all cursor-pointer ${
                      selectedDeviceId === device.id
                        ? 'bg-blue-600 border-blue-400'
                        : 'bg-gray-800 border-transparent hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={device.type === 'fastboot' ? 'text-yellow-400' : 'text-green-400'}><DeviceListIcon /></div>
                      <div>
                        <p className="font-semibold">{device.model}</p>
                        <p className="text-sm text-gray-400">{device.id}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${
                      device.type === 'fastboot' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {device.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">No devices found.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-semibold">Device Details</h3>
              <DeviceDetailsPanel details={selectedDeviceDetails} isLoading={isLoadingDetails} />
            </div>

            {selectedDevice?.type === 'device' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">ADB Reboot Options</h3>
                <RebootControls deviceId={selectedDeviceId} />
              </div>
            )}
            {selectedDevice?.type === 'fastboot' && (
              <FastbootRebootControls deviceId={selectedDeviceId} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
