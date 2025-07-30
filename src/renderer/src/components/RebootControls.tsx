
import type { RebootMode } from '../types'

interface Props {
  deviceId: string | null
}

export function RebootControls({ deviceId }: Props): React.JSX.Element {
  const handleReboot = async (mode: RebootMode) => {
    if (!deviceId) return

    const confirmationMessage =
      mode === 'bootloader' || mode === 'recovery'
        ? `Are you sure you want to reboot to ${mode}? The device will turn off and enter a special mode.`
        : `Are you sure you want to reboot the device?`

    if (window.confirm(confirmationMessage)) {
      try {
        await window.api.rebootDevice(deviceId, mode)
        alert(`Reboot command sent to ${mode} successfully.`)
      } catch (error) {
        alert(`Failed to send reboot command. See console for details.`)
        console.error(error)
      }
    }
  }

  const buttons: { label: string; mode: RebootMode }[] = [
    { label: 'Reboot System', mode: 'system' },
    { label: 'Reboot to Bootloader', mode: 'bootloader' },
    { label: 'Reboot to Recovery', mode: 'recovery' },
    { label: 'Reboot to Fastboot', mode: 'fastboot' }
  ]

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="grid grid-cols-2 gap-3">
        {buttons.map(({ label, mode }) => (
          <button
            key={mode}
            onClick={() => handleReboot(mode)}
            disabled={!deviceId}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors disabled:bg-gray-700/50 disabled:cursor-not-allowed disabled:text-gray-500"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
