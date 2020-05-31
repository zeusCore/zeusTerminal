'use strict'

process.env.BABEL_ENV = 'web'

const webpack = require('webpack')
const path = require('path')
const url = require('url')
const fs = require('fs')
const qs = require('qs')

const isPro = 'production' === process.env.NODE_ENV
const proxyHost = 'books.passkee.com'
// const proxyHost = 'zeusapi.to8to.com'
const pathContext = ['/api/*']

const BabiliWebpackPlugin = require('babili-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

let webConfig = {
    context: path.join(__dirname, '../src/renderer'),
    devtool: '#cheap-module-eval-source-map',
    entry: {
        index: path.join(__dirname, '../src/renderer/index.web.ts'),
        dev: path.join(__dirname, '../src/renderer/dev.ts')
    },
    output: {
        filename: '[name].js?[hash]',
        path: path.join(__dirname, '../dist/web')
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, '../src/renderer'),
            vue$: 'vue/dist/vue.esm.js'
        },
        extensions: ['.js', '.ts', '.vue', '.json', '.css', '.node']
    },
    devServer: {
        host: 'localhost',
        port: 8070
        // proxy: getProxyMaps(pathContext)
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({ filename: 'styles.css' }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.ejs'),
            chunks: ['index'],
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            nodeModules: false
        }),
        new HtmlWebpackPlugin({
            filename: 'dev.html',
            template: path.resolve(__dirname, '../src/index.ejs'),
            chunks: ['dev'],
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            nodeModules: false
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, '../src/renderer/assets/static'),
                to: path.join(__dirname, '../dist/web/static'),
                ignore: ['.*']
            }
        ]),
        new webpack.DefinePlugin({
            'process.env.IS_WEB': 'true'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: { minimize: true, sourceMap: true }
                    }
                ]
            },
            {
                test: /\.postcss$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: { minimize: true, sourceMap: true }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: { minimize: true, sourceMap: true }
                    },
                    { loader: 'less-loader', options: { sourceMap: true } }
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: { minimize: true, sourceMap: true }
                    },
                    {
                        loader: 'sass-loader',
                        options: { indentedSyntax: true, sourceMap: true }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: { minimize: true, sourceMap: true }
                    },
                    { loader: 'sass-loader', options: { sourceMap: true } }
                ]
            },
            {
                test: /\.stylus$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: { minimize: true, sourceMap: true }
                    },
                    { loader: 'stylus-loader', options: { sourceMap: true } }
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: { minimize: true, sourceMap: true }
                    },
                    { loader: 'stylus-loader', options: { sourceMap: true } }
                ]
            },
            {
                test: /\.html$/,
                use: 'vue-html-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: [path.resolve(__dirname, '../src/renderer')],
                exclude: /node_modules/
            },

            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    transpileOnly: true
                }
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        extractCSS: true,
                        loaders: {
                            sass:
                                'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
                            scss: 'vue-style-loader!css-loader!sass-loader',
                            stylus: 'vue-style-loader!css-loader!stylus-loader',
                            less: 'vue-style-loader!css-loader!less-loader'
                        }
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'imgs/[name].[ext]'
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'fonts/[name].[ext]'
                    }
                }
            }
        ]
    },

    target: 'web'
}

/**
 * Adjust webConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
    webConfig.devtool = ''

    webConfig.plugins.push(
        new BabiliWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, '../static'),
                to: path.join(__dirname, '../dist/web/static'),
                ignore: ['.*']
            }
        ]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    )
}

module.exports = webConfig

function getProxyMaps() {
    const maps = {}
    pathContext.forEach((item) => {
        maps[item] = {
            target: 'http://' + proxyHost,
            secure: false,
            changeOrigin: true,
            bypass(req, res, proxyOptions) {
                const ua = req.headers['user-agent']
                let mockmap, map
                if (ua.indexOf('MOCK_MAP') > -1) {
                    map = JSON.parse(ua.split('MOCK_MAP=')[1])
                }

                if (
                    !fs.existsSync(path.join(__dirname, 'mock/mock-map.json'))
                ) {
                    fs.writeFileSync(
                        path.join(__dirname, 'mock/mock-map.json'),
                        `{
                  // 支持双斜杠注销
              }`,
                        { encoding: 'utf-8' }
                    )
                }

                if (fs.existsSync(path.join(__dirname, 'mock/mock-map.json'))) {
                    // 实时读取，更改mock配置后不用重启webpack
                    mockmap = fs.readFileSync(
                        path.join(__dirname, 'mock/mock-map.json'),
                        'utf-8'
                    )
                    mockmap = mockmap
                        .replace(/\s*\/\/.*(?:\r|\n|$)/g, '')
                        .trim()
                    if (mockmap) {
                        try {
                            mockmap = JSON.parse(mockmap)
                        } catch (e) {
                            mockmap = ''
                            console.error(
                                '请检查 mock-map.json 文件的内容是否为合法json'
                                    .red
                            )
                        }
                    }
                }

                // 优先使用ua信息的mock设置
                map = map || mockmap

                const reqPath = url.parse(req.url).pathname
                const reqFullPath = url.parse(req.url).path

                console.log(`request: ${reqPath}`.yellow)

                const rootPath = path.join(__dirname, 'mock')
                for (let x in map) {
                    if (
                        (x.indexOf('?') > -1 && reqFullPath.indexOf(x) > -1) ||
                        reqPath === x
                    ) {
                        const jsonPath = path
                            .join(rootPath, x.split('?')[0], map[x] + '.json')
                            .replace(/\\/g, '/')
                        if (!fs.existsSync(jsonPath)) {
                            console.error(('mock文件不存在：' + jsonPath).red)
                            return
                        }
                        console.info(`mapped: ${jsonPath}`.green)
                        res.sendFile(jsonPath)
                        break
                    }
                }
            }
        }
    })
    return maps
}
