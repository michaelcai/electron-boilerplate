import { app } from 'electron'
import log, { LevelOption } from 'electron-log'
import { autoUpdater } from 'electron-updater'

import packageJSON from '../../package.json'

const setEnv = (env: string) => {
  if (env === 'development') {
    setDataPath('development')
    setlogLevel('debug')
  } else if (env === 'production') {
    setDataPath('production')
    setlogLevel('info')
    setAutoUpdater()
  } else {
    setDataPath('test')
    setlogLevel('debug')
  }
  log.info(env)
  log.info(app.getPath('userData'))
}

const setDataPath = (env: string) => {
  const appPath = app.getPath('appData')

  const newUserDataPath = `${appPath}/electron_${env}`

  // Set User data path
  app.setPath('userData', newUserDataPath)

  // Set log app name to change log file path
  log.transports.file.appName = `electron_${env}`
  log.transports.file.maxSize = 5 * 1024 * 1024
}

const setlogLevel = (level: LevelOption) => {
  log.transports.console.level = level
  log.transports.file.level = level
}

const setAutoUpdater = () => {
  const version: string = packageJSON.version
  const channel = version.split('-')[1]
  autoUpdater.channel = channel
  autoUpdater.logger = log
  autoUpdater.autoDownload = false
  autoUpdater
    .on('update-available', UpdateInfo => {
      if (channel === 'alpha') {
        // Auto update on alpha channel
        autoUpdater.downloadUpdate()
      }
      log.info(UpdateInfo)
    })
    .on('download-progress', ({ percent }) => {
      // update progress
      log.info(percent)
    })
  // Pop up update prompt instead of automatic update
  autoUpdater.checkForUpdatesAndNotify()
}

export default setEnv
