import type { DeviceDetails } from '../types'

interface Props {
  details: DeviceDetails | null
  isLoading?: boolean
}

const BatteryIcon = ({ level }: { level: number }) => {
  let iconPath = <path d="M14 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
  if (level > 15) iconPath = <path d="M14 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
  if (level > 40) iconPath = <path d="M14 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
  if (level > 65) iconPath = <path d="M14 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
  if (level > 90) iconPath = <path d="M14 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width={12 * (level / 100)} height="10" rx="1" ry="1" fill="currentColor" />
      <path d="M18 11h2a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1h-2" />
      <rect x="1" y="6" width="16" height="12" rx="2" ry="2" />
    </svg>
  )
}

export function DeviceDetailsPanel({ details, isLoading }: Props): React.JSX.Element {
  if (isLoading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg animate-pulse">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-5 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!details) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-400 h-full flex items-center justify-center">
        <p>Select a device to see details.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">Model</p>
          <p className="font-semibold">{details.model}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Manufacturer</p>
          <p className="font-semibold">{details.manufacturer}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Android Version</p>
          <p className="font-semibold">{details.androidVersion}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">SDK Version</p>
          <p className="font-semibold">{details.sdkVersion}</p>
        </div>
        {details.batteryLevel !== undefined && (
          <div className="col-span-2">
            <p className="text-sm text-gray-400">Battery</p>
            <div className="flex items-center gap-2 font-semibold">
              <BatteryIcon level={details.batteryLevel} />
              <span>{details.batteryLevel}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
