'use strict'

const { app, dialog, BrowserWindow, Menu, MenuItem } = require('electron')

let win

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://github.com/pakastin/codecam') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // Window menu.
  template[3].submenu = [
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

function createWindow () {
  win = new BrowserWindow({ width: 1920, height: 1080, frame: false })

  win.loadURL(`file://${__dirname}/index.html`)
  // win.webContents.openDevTools()

  win.on('close', function (e) {
    if (win.__recording) {
      e.preventDefault()

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
  })

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
  win.__recording = false
  const menu = Menu.buildFromTemplate(template)

  menu.insert(menu.items.length - 2, new MenuItem({
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
  win.__recording = true

  const menu = Menu.buildFromTemplate(template)

  menu.insert(menu.items.length - 2, new MenuItem({
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
