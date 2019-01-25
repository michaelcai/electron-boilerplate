import { app, BrowserWindow } from 'electron'

const devMenuTemplate = {
  label: 'Development',
  submenu: [
    {
      accelerator: 'CmdOrCtrl+R',
      click: () => {
        BrowserWindow.getFocusedWindow()!.webContents.reloadIgnoringCache()
      },
      label: 'Reload'
    },
    {
      accelerator: 'CmdOrCtrl+Q',
      click: () => {
        app.quit()
      },
      label: 'Quit'
    }
  ]
}

export const macTemplate = [
  {
    label: 'Application',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => {
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' }
    ]
  }
]

export default devMenuTemplate
