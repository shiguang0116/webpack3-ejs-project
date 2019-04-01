/**
 * @description: 参数配置
 * @author: guang.shi <https://blog.csdn.net/guang_s>
 * @date: 2018-01-09 11:32:56 
 */
'use strict';

const path = require('path');

module.exports = {
	// 路径
    assetsRoot: path.resolve(__dirname, '../dist'), // 打包后文件的输出目录 
    assetsPublicPath: '/',      // 指定资源文件引用的目录 
    // 服务
    // host: 'localhost',   // 只可以访问 localhost(127.0.0.1)
    host: '0.0.0.0',        // 0.0.0.0 代表本机的所有IP地址
    port: 8000, 
    autoOpenPage: 'index.html',
    proxyTable: {
        "/api": {
            target: "http://192.168.31.234",
            pathRewrite: { "^/api" : "" }     //后面是重写的新路径
        }
    },
    // 页面数据（ 配置文件扩展了字段: code|title ）
    // pagesData: {
    //     "index"         : { "name": "首页" },
    //     "shopIndex"     : { "name": "商店" },
    //     "shopDetail"    : { "name": "商店详情" }
    // }
};
