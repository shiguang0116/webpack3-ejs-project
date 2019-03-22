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
        filename    : 'js/[name].[chunkhash:7].js',  // 打包后的文件路径
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
                        { 
                            loader: 'postcss-loader',
                            options: {
                                // plugins: function() {
                                //     return [
                                //         //一定要写在require("autoprefixer")前面，否则require("autoprefixer")无效
                                //         require('postcss-import')(),
                                //         require("autoprefixer")({
                                //             "browsers": ["Android >= 4.1", "iOS >= 7.0", "ie >= 8"]
                                //         })
                                //     ];
                                // }
                            } 
                        },
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
                exclude: /node_modules/,
                use: {
                    loader: 'ejs-loader'
                }
            },
            // {
            //     test: /\.js$/,
            //     loader: 'babel-loader',
            //     exclude: /node_modules/
            // },
            // {
            //     test: require.resolve('zepto'),
            //     loader: 'exports-loader?window.Zepto!script-loader'
            // }
        ]
    },
    externals : {
        'jquery' : 'window.jQuery'  // 在编译时，会把 require('jquery') 替换成 window.jQuery
    },
    // 配置路径
    resolve : {
        extensions: ['.js', '.json'],
        alias : {
            'build' : resolve('build'),
            '@'     : resolve('src'),
        },
    },
    plugins: [
        // 把通用模块打包到 main.js/css 里面
        new webpack.optimize.CommonsChunkPlugin({
            name : 'main',
            minChunks: 3,
        }),
        // 把 css 单独打包到文件里
        new ExtractTextPlugin({
            filename: 'css/[name].[contenthash:7].css',
            // disable: process.env.NODE_ENV === "dev",
            allChunks: true,
        }),
        // new webpack.LoaderOptionsPlugin({ //浏览器加前缀
        //     options: {
        //         postcss: [require('autoprefixer')({browsers:['last 5 versions']})]
        //     }
        // }),
        // 复制文件
        new CopyWebpackPlugin([
            {
                from: resolve('src/libs/**/*.js'),
                to: 'js/[name].[ext]',
                toType: 'template',
            },
            {
                from: resolve('src/libs/**/*.css'),
                to: 'css/[name].[ext]',
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
        chunks      : ['main', page],   // 只引入 main 和该页面对应的 js/css 文件
        chunksSortMode: 'manual'        // 控制 chunk 的排序。none | auto（默认）| dependency（依赖）| manual（手动）| {function}
    };
    webpackBaseConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = webpackBaseConfig;
