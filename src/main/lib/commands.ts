import { exec } from 'child_process'
import type { Device, DeviceDetails } from '../../renderer/src/types'

function runCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command Error: ${error.message}`)
        reject(error)
        return
      }
      if (stderr) {
        console.warn(`Command Stderr: ${stderr}`)
      }
      resolve(stdout)
    })
  })
}

export async function getAdbDevices(): Promise<Device[]> {
  try {
    const stdout = await runCommand('adb devices -l')
    const lines = stdout.split('\n').slice(1)
    const devices = lines
      .map((line) => {
        if (line.trim() === '') return null
        const parts = line.split(/\s+/)
        const id = parts[0]
        const type = parts[1]
        const modelMatch = line.match(/model:(\S+)/)
        const model = modelMatch ? modelMatch[1] : 'Unknown Device'
        return { id, type, model }
      })
      .filter((device): device is Device => device !== null)
    return devices
  } catch (error) {
    return []
  }
}

export async function getAdbDeviceDetails(deviceId: string): Promise<DeviceDetails | null> {
  try {
    const propPromise = runCommand(`adb -s ${deviceId} shell getprop`)
    const batteryPromise = runCommand(`adb -s ${deviceId} shell dumpsys battery`)

    const [propOutput, batteryOutput] = await Promise.all([propPromise, batteryPromise])

    const props = new Map<string, string>()
    propOutput.split('\n').forEach((line) => {
      const match = line.match(/\[(.*?)\]: \[(.*?)\]/)
      if (match && match[1] && match[2]) {
        props.set(match[1].trim(), match[2].trim())
      }
    })

    const batteryLevelMatch = batteryOutput.match(/level: (\d+)/)
    const batteryLevel = batteryLevelMatch ? parseInt(batteryLevelMatch[1]) : undefined

    return {
      model: props.get('ro.product.model') || 'Unknown',
      manufacturer: props.get('ro.product.manufacturer') || 'Unknown',
      androidVersion: props.get('ro.build.version.release') || 'Unknown',
      sdkVersion: props.get('ro.build.version.sdk') || 'Unknown',
      batteryLevel: batteryLevel
    }
  } catch (error) {
    console.error(`Failed to get details for ${deviceId}`, error)
    return null
  }
}

export async function rebootAdbDevice(
  deviceId: string,
  mode: 'system' | 'bootloader' | 'recovery' | 'fastboot'
): Promise<void> {
  try {
    const command =
      mode === 'system' ? `adb -s ${deviceId} reboot` : `adb -s ${deviceId} reboot ${mode}`
    await runCommand(command)
  } catch (error) {
    console.error(`Failed to reboot device ${deviceId} to ${mode}`, error)
    throw error
  }
}
