'use strict'
/* global Blob, MediaRecorder, URL */
const { desktopCapturer, remote } = require('electron')

const win = remote.getCurrentWindow()
const [ wWidth, wHeight ] = win.getSize()

const editor = document.getElementById('editor')
const start = document.getElementById('start')
const stop = document.getElementById('stop')

document.body.removeChild(stop)

start.onclick = () => {
  document.body.removeChild(start)
  editor.focus()
  record()
}

stop.onclick = () => {
  document.body.removeChild(stop)
  editor.focus()
  record()
}

function record () {
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
}

function handleStream (stream) {
  const chunks = []
  const rec = new MediaRecorder(stream, { mimeType: 'video/webm' })
  rec.ondataavailable = handleDataAvailable
  rec.start()

  function handleDataAvailable (e) {
    if (e.data.size > 0) {
      chunks.push(e.data)
    }
  }

  window.onbeforeunload = (e) => {
    e.returnValue = false
    rec.stop()
    document.body.appendChild(stop)
    setTimeout(() => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = 'CodeCam ' + new Date().toLocaleString() + '.webm'
      a.click()
      window.URL.revokeObjectURL(url)
      window.onbeforeunload = null
    }, 100)
  }
}

function handleError (e) {
  console.log(e)
}
