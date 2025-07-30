import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { exec } from 'child_process'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('get-devices', () => {
    return new Promise((resolve) => {
      exec('adb devices -l', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`)
          resolve([])
          return
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`)
        }

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
          .filter((device): device is { id: string; type: string; model: string } => device !== null)

        resolve(devices)
      })
    })
  })

  ipcMain.handle('get-device-details', async (_, deviceId: string) => {
    const command = `adb -s ${deviceId} shell getprop`

    return new Promise((resolve) => {
      exec(command, (error, stdout) => {
        if (error) {
          console.error(`getprop error: ${error}`)
          resolve(null)
          return
        }

        // Ubah output menjadi objek yang mudah dibaca
        const props = new Map<string, string>()
        stdout.split('\n').forEach((line) => {
          const match = line.match(/\[(.*?)\]: \[(.*?)\]/)
          if (match && match[1] && match[2]) {
            props.set(match[1].trim(), match[2].trim())
          }
        })

        const details = {
          model: props.get('ro.product.model') || 'Unknown',
          manufacturer: props.get('ro.product.manufacturer') || 'Unknown',
          androidVersion: props.get('ro.build.version.release') || 'Unknown',
          sdkVersion: props.get('ro.build.version.sdk') || 'Unknown'
        }

        resolve(details)
      })
    })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
