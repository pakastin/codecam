'use strict'
/* global Blob, MediaRecorder, URL */
const { desktopCapturer, ipcRenderer, remote } = require('electron')

ipcRenderer.on('record-start', () => {
  const win = remote.getCurrentWindow()
  record(win)
})

ipcRenderer.on('record-stop', () => {
  const win = remote.getCurrentWindow()
  stop(win)
})

function record (win) {
  if (win.__rec) {
    return
  }
  win.__rec = {}
  const [ wWidth, wHeight ] = win.getSize()
  desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
    if (error) throw error
    for (let i = 0; i < sources.length; ++i) {
      if (sources[i].name === 'CodeCam') {
        navigator.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sources[i].id,
              minWidth: wWidth,
              maxWidth: wWidth,
              minHeight: wHeight,
              maxHeight: wHeight
            }
          }
        }, handleStream, handleError)
        return
      }
    }
  })

  function handleStream (stream) {
    const chunks = []
    const rec = new MediaRecorder(stream, { mimeType: 'video/webm' })
    win.__rec.chunks = chunks
    win.__rec.rec = rec
    rec.ondataavailable = handleDataAvailable
    rec.start()

    function handleDataAvailable (e) {
      if (e.data.size > 0) {
        chunks.push(e.data)
      }
    }
  }

  function handleError (e) {
    console.log(e)
  }
}

function stop (win) {
  if (!win.__rec) {
    return
  }
  const { rec, chunks } = win.__rec
  rec.stop()
  const blob = new Blob(chunks, { type: 'video/webm' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = 'CodeCam ' + new Date().toLocaleString() + '.webm'
  a.click()
  win.URL.revokeObjectURL(url)
}
