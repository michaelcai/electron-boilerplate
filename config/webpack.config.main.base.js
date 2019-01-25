const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const path = require('path')
const paths = require('./paths')

const translateEnvToMode = env => {
  if (env === 'production') {
    return 'production'
  }
  return 'development'
}

const publicUrl = ''

const getClientEnvironment = require('./env')
getClientEnvironment(publicUrl)

module.exports = env => {
  return {
    stats: 'errors-only',
    target: 'electron-main',
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
      plugins: [new TsconfigPathsPlugin({ configFile: paths.appTsMainConfig })]
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          loader: require.resolve('source-map-loader'),
          enforce: 'pre',
          include: paths.electronApp
        },
        {
          oneOf: [
            {
              test: /\.(js|jsx|mjs)$/,
              include: paths.electronApp,
              loader: require.resolve('babel-loader'),
              options: {
                compact: true
              }
            },
            {
              test: /\.ts$/,
              include: paths.electronApp,
              use: [
                {
                  loader: require.resolve('ts-loader'),
                  options: {
                    transpileOnly: true
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        async: false,
        tsconfig: paths.appTsMainConfig,
        tslint: paths.appTsLint
      })
    ]
  }
}
