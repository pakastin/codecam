const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({ width: 1920, height: 1080, frame: false })

  mainWindow.loadURL(`file://${__dirname}/index.html`)
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
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
