const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WWPlugin = require('./ww_plugin.js')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

global.port = '8080'

const VERS = require('../package.json').version
const BANNER = `/*!
* TradingVue3.JS - v${VERS}
* Forked from https://github.com/tvjsx/trading-vue-js
* Current fork: https://github.com/Mikhail-Sennikov/trading-vue3-js
* Licensed under MIT
*/`

module.exports = (env, options) => ({
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader'
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                            transpileOnly: true
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /script_ww\.js$/,
                loader: 'worker-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json']
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new WWPlugin(),
        new webpack.BannerPlugin({
            banner: BANNER
        }),
        new webpack.DefinePlugin({
            MOB_DEBUG: JSON.stringify(process.env.MOB_DEBUG === 'true')
        })
    ],
    devServer: {
        host: '0.0.0.0',
        onListening: function(server) {
            const port = server.listeningApp.address().port
            global.port = port
        },
        before(app) {
            app.get("/debug", function(req, res) {
                try {
                    let argv = JSON.parse(req.query.argv)
                    console.log(...argv)
                } catch(e) {}
                res.send("[OK]")
            })
        }
    },
    optimization: {
        minimize: options.mode === 'production',
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: {
                        reserved: ['_id', '_tf']
                    }
                }
            })
        ]
    },
    devtool: 'source-map'
})
