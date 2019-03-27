/**
 * @description: 自定义过滤器
 * @author: guang.shi <https://blog.csdn.net/guang_s> 
 * @date: 2019-03-26 11:57:38 
 */

// 返回过滤的方法
template.defaults.imports.filter = function(source, name, param){
    return template.defaults.imports[name](source, param);
};
// 枚举对象的查询
template.defaults.imports.enumeration = function(source, option){
    return _sv.enumeration[option][source];
};
// 格式化日期
template.defaults.imports.dateFormat = function(source, format){
    return _util.date.format(source, format);
};
// 处理模板，转义 {{}} 数据
template.defaults.imports.handerTpl = function (source, row) {
    source = source.replace(/\{\{.*?\}\}/, function(value){
        value = value.replace('{{', '').replace('}}', '');
        
        var pointIndex, fiterIndex, propertyName, propertyValue, filterFn, filterName, filterParam;

        // {{row}} 只会返回 [object Object]，因此需要传递 row 时，在父节点设置 data-row 即可（如：tr）
        pointIndex = value.indexOf('.');
        if(pointIndex == -1) return row;

        // 获取属性值
        fiterIndex = value.indexOf('|') > -1 ? value.indexOf('|') : value.length;
        propertyName = _util.trim(value.substring(pointIndex + 1, fiterIndex));
        propertyValue = _util.object.getValue(row, propertyName);
        if(value.indexOf('|') == -1) return propertyValue;

        // 过滤属性值
        filterFn = _util.trim(value.substring(fiterIndex + 1));
        var spaceIndex = filterFn.indexOf(' ');
        if(spaceIndex == -1) {
            filterName = filterFn;
        }
        else {
            filterName = _util.trim(filterFn.substring(0, spaceIndex));
            filterParam = _util.trim(filterFn.substring(spaceIndex + 1));
        }
        return template.defaults.imports[filterName](propertyValue, filterParam);
    });
    return source;
};

// 改变解析规则，避免和ejs模板冲突
var rule = template.defaults.rules[0];
rule.test = new RegExp(rule.test.source.replace('<%', '<\\\?').replace('%>', '\\\?>'));