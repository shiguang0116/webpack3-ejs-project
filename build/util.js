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

// 获取入口文件
util.getEntries = function (globPath) {
    let entries = {};
    glob.sync(globPath).forEach(function (entry) {
        let list = entry.split('/');
        var fileName = list[list.length - 1];
        let moduleName = fileName.slice(0, fileName.indexOf('.'));
        // 文件名不能重复的验证（moduleName 在这里取的是文件名。建议把所有上级目录的文件夹名称（不包括src/pages）拼接而成的名字作为最终文件名）
        if(entries[moduleName]){
            console.error(colors.red(`文件名不能重复使用：${moduleName}。\n`));
            process.exit(1);
        }
        entries[moduleName] = entry;
    });
    return entries;
};

module.exports = util;