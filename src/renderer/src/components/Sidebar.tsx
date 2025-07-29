const DeviceIcon = () => (
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

export function Sidebar(): React.JSX.Element {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">ADB & Fastboot Tools</h1>
      </div>
      <nav className="flex-1 p-2">
        <ul>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-500 text-white"
            >
              <DeviceIcon />
              <span>Devices</span>
            </a>
          </li>
          {/* Tautan lain bisa ditambahkan di sini nanti */}
        </ul>
      </nav>
    </aside>
  )
}
