const merge = require('webpack-merge')
const base = require('./webpack.config.main.base')
const path = require('path')
const paths = require('./paths')
const env = 'development'

module.exports = merge.smart(base(env),{
  entry: {
    index: [paths.mainIndexJs]
  },
  externals: [
    function(context, request, callback) {
      if (request.match(/devtron/)) {
        return callback(null, 'commonjs ' + request)
      }

      callback()
    }
  ],
  output: {
    path: paths.appBuild,
    pathinfo: false,
    filename: 'app.js'
  },
})