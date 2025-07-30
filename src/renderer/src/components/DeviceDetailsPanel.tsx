import type { DeviceDetails } from '../types'

interface Props {
  details: DeviceDetails | null
}

export function DeviceDetailsPanel({ details }: Props): React.JSX.Element {
  if (!details) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-400">
        Select a device to see details.
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
      </div>
    </div>
  )
}
