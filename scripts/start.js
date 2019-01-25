'use strict'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'
process.env.REACT_APP_ENV = 'development'

process.on('unhandledRejection', err => {
  throw err
})

// Ensure environment variables are read.
require('../config/env')

const childProcess = require('child_process')
const path = require('path')
const electron = require('electron')
const webpack = require('webpack')
const serve = require('webpack-serve')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const chalk = require('chalk')
const convert = require('koa-connect')
const history = require('connect-history-api-fallback')

const paths = require('../config/paths')
const rendererConfig = require('../config/webpack.config.renderer.dev')
const mainConfig = require('../config/webpack.config.main.dev')

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1)
}

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'

const runDevServer = () => {
  console.log(chalk.cyan('\nStarting the development server...\n'))
  choosePort(HOST, DEFAULT_PORT)
    .then(port => {
      if (port == null) {
        // We have not found a port.
        return
      }

      process.env.URL = `${HOST}:${port}`
      serve(
        {},
        {
          webpack,
          config: rendererConfig,
          host: HOST,
          port,
          clipboard: false,
          logLevel: 'silent',
          hotClient: {
            logLevel: 'silent',
            validTargets: ['electron-renderer']
          },
          devMiddleware: {
            publicPath: '/',
            logLevel: 'silent'
          },
          add: app => {
            app.use(convert(history()))
          }
        }
      )
        .then(() => {
          const electronProcess = childProcess.spawn(electron, [path.join('build', 'app.js')])
          electronProcess.on('close', () => {
            process.exit()
          })
          electronProcess.stdout.on('data', data => {
            console.log(chalk.bgYellow(chalk.black('Electron log')))
            console.log(chalk.yellow(data.toString()))
          })
        })
        .catch(err => {
          console.error(err)
        })
      ;['SIGINT', 'SIGTERM'].forEach(function(sig) {
        process.on(sig, function() {
          process.exit()
        })
      })
    })
    .catch(err => {
      if (err && err.message) {
        console.log(err.message)
      }
      process.exit(1)
    })
}

// Check if the main process has been built
if (!checkRequiredFiles([path.join('build', 'app.js')]) || process.env.REBUILD === 'true') {
  const compile = webpack(mainConfig)

  console.log(chalk.cyan('\nBuilding main process...\n'))
  compile.run((err, stats) => {
    if (err) {
      throw err
    }
    const messages = formatWebpackMessages(stats.toJson({}, true))
    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1
      }
      throw new Error(messages.errors.join('\n\n'))
    }
    runDevServer()
  })
} else {
  runDevServer()
}
