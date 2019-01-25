const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const paths = require('./paths')

const publicUrl = ''

const getClientEnvironment = require('./env')
getClientEnvironment(publicUrl)

const translateEnvToMode = env => {
  if (env === 'production') {
    return 'production'
  }
  return 'development'
}

module.exports = env => {
  return {
    bail: translateEnvToMode(env) === 'production',
    target: 'electron-renderer',
    cache: true,
    mode: translateEnvToMode(env),
    node: {
      __dirname: false,
      __filename: false
    },
    resolve: {
      modules: ['node_modules', paths.appNodeModules].concat(
        process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
      ),
      extensions: ['.mjs', '.web.ts', '.ts', '.web.tsx', '.tsx', '.web.js', '.js', '.json', '.web.jsx', '.jsx', 'css'],
      alias: {
        env: path.resolve(__dirname, `../config/env_${env}.json`)
      },
      plugins: [new TsconfigPathsPlugin({ configFile: paths.appTsConfig })]
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          loader: require.resolve('source-map-loader'),
          enforce: 'pre',
          include: paths.appSrc
        }
      ]
    },
    plugins: [
      new FriendlyErrorsPlugin({
        clearConsole: env === 'development'
      })
    ]
  }
}
