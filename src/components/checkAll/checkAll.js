/**
 * @description: 复选框全选
 * @author: guang.shi <https://blog.csdn.net/guang_s> 
 * @date: 2019-03-28 16:23:39 
 */
'use strict';

class checkAll {
    constructor (option) {
        // 初始化参数（可传递的属性）
        option = option || {};
        this.appVm = option.appVm || {};    // 父级作用域
        this.id = option.id || '';          // 复选框的父级id
        this.checkChangeFn = option.checkChangeFn || '';   // 复选框改变事件
        // 其他
        this.$p = $('#' + this.id);
        this.$all = this.$p.find('input[name="checkAll"]');
        this.$one = this.$p.find('input[name="checkOne"]');
        // 加载事件
        this.event();
    }
    event() {
        var self = this;
        // 点击全选框，全选或反选所有项
        this.$all.on('click', function(){
            self.$one.prop('checked', this.checked);
            self.checkChange();
        });
        // 点击单个复选框，判断是否全选
        this.$one.on('click', function(){
            self.$all.prop("checked" , self.$one.length == self.$one.filter(":checked").length ? true : false); 
            self.checkChange();
        });
    }
    checkChange() {
        if(typeof this.appVm[this.checkChangeFn] === 'function') {
            this.appVm[this.checkChangeFn]();
        }
    }
}

export default checkAll;