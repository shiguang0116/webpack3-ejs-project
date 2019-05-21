/**
 * @description: 生产环境配置文件
 * @author: guang.shi <https://blog.csdn.net/guang_s>
 * @date: 2018-01-09 14:45:24
 */
'use strict'

const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config.js')

fs.writeFile('build/env.js', "export default 'build';", function(err) {
    err && console.error(err)
})

const webpackConfig = merge(webpackBaseConfig, {
    plugins: [
        new CleanWebpackPlugin(['dist/*'], {
            root: path.resolve(__dirname, '../')
            // exclude:  []
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('build')
            }
        })
    ]
})

module.exports = webpackConfig
