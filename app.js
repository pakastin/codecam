'use strict'

const { app, BrowserWindow, Menu, MenuItem } = require('electron')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({ width: 1920, height: 1080, frame: false })

  mainWindow.loadURL(`file://${__dirname}/index.html`)
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  const menu = new Menu()

  menu.append(new MenuItem({
    label: 'CodeCam',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click () {
          app.exit()
        }
      }
    ]
  }))

  menu.append(new MenuItem({
    label: 'Record',
    submenu: [
      {
        label: 'Start recording',
        accelerator: 'CmdOrCtrl+U',
        click (item, win) {
          mainWindow.webContents.send('record-start')
        }
      },
      {
        label: 'Stop recording',
        accelerator: 'CmdOrCtrl+I',
        click (item, win) {
          mainWindow.webContents.send('record-stop')
        }
      }
    ]
  }))

  Menu.setApplicationMenu(menu)
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
