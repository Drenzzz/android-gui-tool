function App(): React.JSX.Element {
  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
      {/* Header Aplikasi */}
      <header className="p-4 bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold">Android GUI Tool v1.0</h1>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 p-6">
        <h2 className="text-lg font-semibold mb-4">Device Information</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p>Menunggu koneksi perangkat...</p>
        </div>
      </main>
    </div>
  )
}

export default App
