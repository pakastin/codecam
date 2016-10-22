#!/usr/bin/env node
'use strict'

var cp = require('child_process')

exec('npm', ['start'])

function exec (cmd, args) {
  var child = cp.spawn(cmd, args, { cwd: __dirname })

  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
}
