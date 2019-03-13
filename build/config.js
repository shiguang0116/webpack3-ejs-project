/**
 * @description: 
 * @author: guang.shi <https://blog.csdn.net/guang_s>
 * @date: 2018-01-09 11:32:56 
 */
'use strict';

const path = require('path');

module.exports = {
	// path
    assetsRoot: path.resolve(__dirname, '../dist'), // 打包后文件的输出目录 
    assetsPublicPath: '/',      // 指定资源文件引用的目录 
    // server
    host: 'localhost', 
    port: 8000, 
    autoOpenPage: 'index.html',
    proxyTable: {
        "/api": {
            target: "http://192.168.31.234",
            pathRewrite: { "^/api" : "" }     //后面是重写的新路径
        }
    }
};
