// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
import { app, BrowserWindow, globalShortcut, Menu } from 'electron'
import contextMenu from 'electron-context-menu'
import log from 'electron-log'
import path from 'path'

import setEnv from './helpers/setEnv'
import createWindow from './helpers/window'
import { macTemplate } from './menu/dev_menu_template'
import getStartURL from './utils/getStartUrl'

const env = process.env.NODE_ENV

if (!['darwin', 'win32'].includes(process.platform)) {
  app.disableHardwareAcceleration()
}

// Set context menu
contextMenu()

// Get application lock
const gotTheLock = app.requestSingleInstanceLock()
let mainWindow: BrowserWindow

if (!gotTheLock) {
  // If the lock is not obtained, exit the program
  app.quit()
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })

  app.on('ready', async () => {
    // Set application env
    setEnv(env!)

    if (process.platform === 'darwin') {
      Menu.setApplicationMenu(Menu.buildFromTemplate(macTemplate))
    } else {
      Menu.setApplicationMenu(null)
    }
    
    createMainWindow()
  })
}

const createMainWindow = () => {
  mainWindow = createWindow('main', {
    height: 608,
    resizable: false,
    show: false,
    width: 1080,
    icon: path.join(__dirname, 'icons/512.png')
  })

  mainWindow.loadURL(getStartURL(env, process.env.IS_MAIN))

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }

    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.webContents.on('crashed', err => {
    log.error(err)
  })

  mainWindow.on('unresponsive', err => {
    log.error(err)
  })

  mainWindow.on('closed', () => {
    log.info('main window are closed')
    ;(mainWindow as any) = null
  })

  globalShortcut.register('f12', () => {
    mainWindow.webContents.openDevTools()
  })
}

app.on('window-all-closed', () => {
  log.info('window all closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (env === 'production') {
    if (mainWindow === null) {
      createMainWindow()
    }
  }
})
