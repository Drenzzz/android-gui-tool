import type { FastbootRebootMode } from '../types'

interface Props {
  deviceId: string | null
}

export function FastbootRebootControls({ deviceId }: Props): React.JSX.Element {
  const handleReboot = async (mode: FastbootRebootMode) => {
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

  const buttons: { label: string; mode: FastbootRebootMode }[] = [
    { label: 'Reboot System', mode: 'system' },
    { label: 'Reboot to Bootloader', mode: 'bootloader' },
    { label: 'Reboot to Recovery', mode: 'recovery' },
    { label: 'Reboot to Fastboot', mode: 'fastboot' }
  ]

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Fastboot Reboot Options</h3>
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-3">
          {buttons.map(({ label, mode }) => (
            <button
              key={mode}
              onClick={() => handleReboot(mode)}
              disabled={!deviceId}
              className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
