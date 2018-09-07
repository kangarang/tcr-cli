#!/usr/bin/env node

const yargs = require('yargs')
const initArgs = require('./args')
// callback handlers
const handlers = require('./handlers')

// setup yargs
const detailedVersion = 'tcr-cli v1.0.0'
// command handlers get called before argv gets returned
const argv = initArgs(yargs, detailedVersion, handlers).argv
const options = {
  verbose: argv.v,
  number: argv.n,
}

if (options.verbose) {
  console.log('options:', options)
}

process.on('unhandledRejection', function(error) {
  console.log('unhandled rejection:', error.toString())
  process.exit(1)
})

process.on('uncaughtException', function(error) {
  console.log('critical', {
    message: 'Process encountered an uncaughtException',
    error,
  })
  console.log('uncaught exception', error.stack)
  process.exit(1)
})
