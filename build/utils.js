/**
 * @description: 配置文件通用工具
 * @author: guang.shi <https://blog.csdn.net/guang_s> 
 * @date: 2018-01-09 11:36:54 
 */
'use strict';

const glob      = require('glob');
const path      = require('path');
const colors    = require('colors');
const config    = require('./config.js');

const util = {};

util.assetsPath = function (_path) {
    const assetsSubDirectory = config.assetsSubDirectory;
    return path.posix.join(assetsSubDirectory, _path);
};

// 获取文件名以及对应路径
util.getModules = function (globPath) {
    const modules = {};
    glob.sync(globPath).forEach(function (url) {
        const ext = path.extname(url); // 获取文件后缀
        const moduleName = path.basename(url, ext); // 获取文件名
        // 文件名不能重复的验证（moduleName 在这里取的是文件名。建议把所有上级目录的文件夹名称（不包括src/pages）拼接而成的名字作为最终文件名）
        if(modules[moduleName]){
            console.error(colors.red(`文件名不能重复使用：${moduleName}。\n`));
            process.exit(1);
        }
        modules[moduleName] = url;
    });
    return modules;
};

module.exports = util;