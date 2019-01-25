const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const base = require('./webpack.config.main.base')
const paths = require('./paths')
const env = 'production'
module.exports = merge.smart(base(env), {
  devtool: 'source-map',
  entry: paths.mainIndexJs,
  externals: [nodeExternals()],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: false
      })
    ]
  },
  output: {
    path: paths.appBuild,
    pathinfo: false,
    filename: 'app.js'
  }
})
