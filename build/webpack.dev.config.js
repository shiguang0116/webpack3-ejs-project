/**
 * @description: 开发环境配置文件
 * @author: guang.shi <https://blog.csdn.net/guang_s>
 * @date: 2018-01-09 11:37:39
 */
'use strict'

const webpack = require('webpack')
const fs = require('fs')
const merge = require('webpack-merge')
const config = require('./config.js')
const webpackBaseConfig = require('./webpack.base.config.js')

fs.writeFile('build/env.js', "export default 'dev'", function(err) {
    err && console.error(err)
})

const webpackConfig = merge(webpackBaseConfig, {
    devServer: {
        contentBase: config.assetsRoot, // 本地服务器所加载的页面所在的目录
        inline: true,
        host: config.host,
        port: config.port,
        open: true,
        openPage: config.autoOpenPage,
        disableHostCheck: true,
        proxy: config.proxyTable
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('dev')
            }
        })
    ]
})

module.exports = webpackConfig
