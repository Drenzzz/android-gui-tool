import type { AdbRebootMode, FastbootRebootMode } from '../types'

interface Props {
  deviceId: string | null
  deviceType: 'device' | 'fastboot' | string | null | undefined
}

export function RebootControls({ deviceId, deviceType }: Props): React.JSX.Element {
  const handleAdbReboot = async (mode: AdbRebootMode) => {
    if (!deviceId) return
    if (window.confirm(`Are you sure you want to send 'adb reboot ${mode}' command?`)) {
      try {
        await window.api.rebootDevice(deviceId, mode)
        alert(`Command sent successfully.`)
      } catch (error) {
        alert(`Failed to send command. See console for details.`)
      }
    }
  }

  const handleFastbootReboot = async (mode: FastbootRebootMode) => {
    if (!deviceId) return
    if (window.confirm(`Are you sure you want to send 'fastboot reboot ${mode}' command?`)) {
      try {
        await window.api.rebootFastbootDevice(deviceId, mode)
        alert(`Command sent successfully.`)
      } catch (error) {
        alert(`Failed to send command. See console for details.`)
      }
    }
  }

  if (deviceType === 'device') {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">ADB Reboot Options</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAdbReboot('system')}
            disabled={!deviceId}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reboot System
          </button>
          <button
            onClick={() => handleAdbReboot('recovery')}
            disabled={!deviceId}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reboot to Recovery
          </button>
          <button
            onClick={() => handleAdbReboot('bootloader')}
            disabled={!deviceId}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reboot to Bootloader
          </button>
          <button
            onClick={() => handleAdbReboot('fastboot')}
            disabled={!deviceId}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reboot to Fastboot
          </button>
        </div>
      </div>
    )
  }

  if (deviceType === 'fastboot') {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Fastboot Reboot Options</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleFastbootReboot('system')}
            disabled={!deviceId}
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reboot System
          </button>
          <button
            onClick={() => handleFastbootReboot('bootloader')}
            disabled={!deviceId}
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reboot to Bootloader
          </button>
          <button
            onClick={() => handleFastbootReboot('recovery')}
            disabled={!deviceId}
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reboot to Recovery
          </button>
          <button
            onClick={() => handleFastbootReboot('fastboot')}
            disabled={!deviceId}
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reboot to Fastboot
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Reboot Options</h3>
      <p className="text-sm text-gray-500 text-center">No device selected</p>
    </div>
  )
}
