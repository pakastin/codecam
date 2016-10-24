'use strict'

const { app, dialog, BrowserWindow, Menu, MenuItem } = require('electron')

let win

function createWindow () {
  win = new BrowserWindow({ width: 1920, height: 1080, frame: false })

  win.loadURL(`file://${__dirname}/index.html`)
  //win.webContents.openDevTools()

  win.on('closed', function () {
    win = null
  })

  defaultMenu(win)
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (win === null) {
    createWindow()
  }
})

function defaultMenu (win) {
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
          recordMenu(win)
          win.webContents.send('record-start')
        }
      }
    ]
  }))

  Menu.setApplicationMenu(menu)
}

function recordMenu (win) {
  const menu = new Menu()

  menu.append(new MenuItem({
    label: 'CodeCam',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click () {
          dialog.showMessageBox(win, {
            type: 'warning',
            buttons: ['Yes', 'No'],
            title: 'Confirm',
            message: 'Recording is still on. Still want to exit?'
          }, (confirm) => {
            if (confirm === 0) {
              win.onbeforeunload = null
              app.exit()
            }
          })
        }
      }
    ]
  }))

  menu.append(new MenuItem({
    label: 'RECORDING...',
    submenu: [
      {
        label: 'Stop recording',
        accelerator: 'CmdOrCtrl+I',
        click (item, win) {
          defaultMenu(win)
          win.webContents.send('record-stop')
        }
      }
    ]
  }))

  Menu.setApplicationMenu(menu)
}
