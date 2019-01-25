const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ManifestPlugin = require('webpack-manifest-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const nodeExternals = require('webpack-node-externals')
const tsImportPluginFactory = require('ts-import-plugin')
const base = require('./webpack.config.renderer.base')
const paths = require('./paths')

const publicPath = `./`
const publicUrl = ''

const getClientEnvironment = require('./env')
const globalEnv = getClientEnvironment(publicUrl)

const cssFilename = 'static/css/[name].[contenthash:8].css'

const env = 'production'

module.exports = merge(base(env), {
  entry: {
    index: [require.resolve('./polyfills'), paths.appIndexJs]
  },
  // externals: [nodeExternals()],
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'static/js/bundle.[hash:8].js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  },
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
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.woff$/, /\.woff2$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              compact: true
            }
          },
          {
            test: /\.(ts|tsx)$/,
            include: paths.appSrc,
            use: [
              {
                loader: require.resolve('ts-loader'),
                options: {
                  transpileOnly: true,
                  getCustomTransformers: () => ({
                    before: [
                      tsImportPluginFactory([
                        {
                          libraryName: '@material-ui/core',
                          libraryDirectory: '',
                          camel2DashComponentName: false
                        },
                        {
                          style: false,
                          libraryName: 'lodash',
                          libraryDirectory: null,
                          camel2DashComponentName: false
                        },
                        {
                          style: false,
                          libraryName: 'date-fns',
                          libraryDirectory: null,
                          camel2DashComponentName: false
                        },
                        {
                          libraryDirectory: importName => {
                            const stringVec = importName
                              .split(/([A-Z][a-z]+|[0-9]*)/)
                              .filter(s => s.length)
                              .map(s => s.toLocaleLowerCase())

                            return stringVec.reduce((acc, cur, index) => {
                              if (index > 1) {
                                return acc + '-' + cur
                              } else if (index === 1) {
                                return acc + '/' + cur
                              }
                              return acc + cur
                            }, '')
                          },
                          libraryName: '@material-ui/icons',
                          style: false,
                          camel2DashComponentName: false
                        }
                      ])
                    ]
                  })
                }
              }
            ]
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: { publicPath: Array(cssFilename.split('/').length).join('../') }
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-cssnext'),
                    require('cssnano')({
                      preset: 'advanced',
                      autoprefixer: false,
                      'postcss-zindex': false
                    })
                  ]
                }
              }
            ]
          },
          {
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
    }),
    new webpack.DefinePlugin(globalEnv.stringified),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: cssFilename
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      tsconfig: paths.appTsConfig,
      tslint: paths.appTsLint
    })
  ]
})
