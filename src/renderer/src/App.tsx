import { useState, useEffect } from 'react'

function App(): React.JSX.Element {
  const [deviceInfo, setDeviceInfo] = useState('Menunggu koneksi perangkat...')

  useEffect(() => {
    window.api.getAdbVersion().then((version) => {
      setDeviceInfo(version)
    })
  }, [])

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
      <header className="p-4 bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold">Android GUI Tool v1.0</h1>
      </header>

      <main className="flex-1 p-6">
        <h2 className="text-lg font-semibold mb-4">Device Information</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          {/* Tampilkan informasi dari state */}
          <p>{deviceInfo}</p>
        </div>
      </main>
    </div>
  )
}

export default App
