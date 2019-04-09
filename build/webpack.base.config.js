/**
 * @description: webpack基础配置文件
 * @author: guang.shi <https://blog.csdn.net/guang_s> 
 * @date: 2018-01-09 11:37:29 
 */
'use strict';

const webpack             = require('webpack');
const path                = require('path');
const ExtractTextPlugin   = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin   = require('html-webpack-plugin');
const CopyWebpackPlugin   = require('copy-webpack-plugin');
const util                = require('./util.js');
const config              = require('./config.js');

function resolve(_path){
    return path.resolve(__dirname, '../' + _path);
}

// 配置
const webpackBaseConfig = {
    entry: Object.assign(util.getEntries('./src/pages/**/*.js'),
        { 'main' : '@/main.js' }
    ),
    output: {
        path        : config.assetsRoot,                // 打包后文件的输出目录 
        filename    : 'js/[name].[chunkhash:7].js',     // 打包后的文件路径
        publicPath  : config.assetsPublicPath,          // 指定资源文件引用的目录 
    },
    module: {
        rules: [
            { 
                test: /\.css$/, 
                use: ExtractTextPlugin.extract({  
                    fallback: "style-loader",  
                    use: ['css-loader','postcss-loader']
                })
            },
            { 
                test: /\.less$/, 
                use: ExtractTextPlugin.extract({  
                    fallback: "style-loader",  
                    use: [
                        { loader: 'css-loader' },
                        { loader: 'postcss-loader' },
                        { loader: 'less-loader' },
                    ]
                }) 
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',   // 把图片编码成base64格式写进页面，从而减少服务器请求。
                options: {
                    limit: 10000,       // 超过多少字节时使用 file-loader 加载文件
                    name: 'images/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(ejs|tpl)$/,
                // exclude: /node_modules/,
                include: [resolve('src')],
                use: {
                    loader: 'ejs-loader'
                }
            },
            {
                test: /\.js$/,
                include: [resolve('src')],
                loader: 'babel-loader'
            },
            {
                test: require.resolve('jquery'), // 查询模块文件名
                use: [
                    {
                        loader: 'expose-loader',
                        options: '$'
                    },
                    {
                        loader: 'expose-loader',
                        options: 'jQuery'
                    }
                ]
            },
            {
                test: require.resolve('art-template/lib/template-web.js'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'template'
                    }
                ]
            }
        ]
    },
    externals : {
        // 在编译时，会把 require('jquery') 替换成 window.jQuery，因此只适用于用script标签引入jQuery的情况
        // 'jquery' : 'window.jQuery'  
    },
    // 配置路径
    resolve : {
        extensions: ['.js', '.json'],
        alias : {
            'build'     : resolve('build'),
            '@'         : resolve('src'),
        },
    },
    plugins: [
        // 抽出第三方库，命名vendor
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                // 从 node_module 出来的所有模块
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                );
            }
        }),
        // 抽出mainfest（webpack运行代码，管理模块交互）
        new webpack.optimize.CommonsChunkPlugin({ 
            name: 'manifest',
            minChunks: Infinity
        }),
        // 提取通用模块到 main.js/css 里面
        new webpack.optimize.CommonsChunkPlugin({
            name : 'main',
            async: 'vendor-async',
            children: true,
            minChunks: 3,
        }),
        // 提取css
        new ExtractTextPlugin({
            // filename: 'css/[name].[contenthash:7].css',
            filename: 'css/main.min.[contenthash:7].css',
            // disable: process.env.NODE_ENV === "dev",
            allChunks: true,
        }),
        // 复制文件
        new CopyWebpackPlugin([
            {
                from: resolve('src/libs/**/*.js'),
                to: 'js/[name].[ext]',
                toType: 'template',
            }
        ])
    ]
};

// 配置html文件
const pagesEntries = util.getEntries('./src/pages/**/*.ejs');
for(let page in pagesEntries) {
    let pageData = {
        code : page
    };
    let conf = {
        pageData    : pageData,
        template    : pagesEntries[page],
        filename    : page + '.html',   // 打包后的文件路径
        favicon     : './favicon.ico',  // 图标路径
        inject      : true,             // js文件将被放置在body元素的底部
        // minify      : true,             // 压缩
        chunks      : ['manifest', 'vendor', 'main', page],   // 引入公共资源和 该页面对应的 js/css 文件
        chunksSortMode: 'manual'        // 控制 chunk 的排序。none | auto（默认）| dependency（依赖）| manual（手动）| {function}
    };
    webpackBaseConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = webpackBaseConfig;
