/**
 * @description: table组件
 * @author: guang.shi <https://blog.csdn.net/guang_s> 
 * @date: 2019-03-27 12:53:43 
 */
'use strict';

import './table.less';
import CheckAll from '../checkAll/checkAll.js';

class Table {
    constructor (option) {
        // 初始化参数（可传递的属性）
        option = option || {};
        this.appVm = option.appVm || {};    // 父级作用域
        this.api = option.api;              // 提供api接口
        this.id = option.id || 'table';     // 组件id（一个页面引入多个组件时，id不能重复）
        this.autoLoad = option.autoLoad === undefined ? true : option.autoLoad;                 // 是否自动加载数据
        this.showDeleteBtn = option.showDeleteBtn === undefined ? true : option.showDeleteBtn;  // 是否显示删除按钮
        this.showModifyBtn = option.showModifyBtn === undefined ? true : option.showModifyBtn;  // 是否显示修改按钮
        this.showReloadBtn = option.showReloadBtn === undefined ? true : option.showReloadBtn;  // 是否显示刷新按钮
        this.deleteFn = option.deleteFn || '';          // 批量删除
        this.loadDataFn = option.loadDataFn || '';      // 加载数据
        this.selectionChangeFn = option.selectionChangeFn || ''; // 选择项改变事件
        this.columns = option.columns || [];        // 列数据
        this.listData = option.listData || [];      // 表格数据
        // 其他
        this.actionId = this.id + '_action';
        this.conId = this.id + '_con';
        this.tplId = this.id + '_tpl';
        this.$p = $('#' + this.id);
        this.$con = $('#' + this.conId);
        this.$action = $('#' + this.actionId);
        // 初始化操作按钮
        this.$del = this.$action.find('button[name="delete"]');
        this.$edit = this.$action.find('button[name="edit"]');
        this.$reload = this.$action.find('button[name="reload"]');
        if(!this.showDeleteBtn) this.$del.hide();
        if(!this.showModifyBtn) this.$edit.hide();
        if(!this.showReloadBtn) this.$reload.hide();
        // 加载数据
        if(this.autoLoad) this.loadData();
        this.initColumns();
        this.render();
        this.event();
        this.apiExtend();
    }
    loadData() {
        // promise
        var ret = this.appVm[this.loadDataFn]();
        this.listData = ret || [];
    }
    extendColumns() {
        if(typeof this.appVm[this.extendColumnsFn] === 'function'){
            var ret = this.appVm[this.extendColumnsFn]();
            this.columns = ret || [];
        }
    }
    initColumns() {
        this.extendColumns();   // 扩展动态列
        this.innerColumns = _util.copy(this.columns);   // 深拷贝，避免污染数据

        if(this.innerColumns.length == 0) return;
        
        _util.forEach(this.innerColumns, function(i, item){
            // 列是否可见
            if (item.visible !== false) item.visible = true;
            // 复选框
            if (item.field == "checkbox") {
                item.title = '<input type="checkbox" name="checkAll">';
                item.cellTemplate = '<input type="checkbox" name="checkOne">';
            }
            // 操作列
            else if (item.field == "action") {
                
            }
            // 单元格模板
            else if (!item.cellTemplate) {
                item.cellTemplate = '<span>{{row.' + item.field + '}}</span>';
            }
        });
    }
    render() {
        var data = {
            columns: this.innerColumns,
            listData: this.listData
        };
        var html = template(this.tplId, data);
        this.$con.html(html);
        // 复选框
        var $all = this.$p.find('input[name="checkAll"]');
        if($all.length) {
            new CheckAll({
                appVm: this,
                id: this.conId,
                checkChangeFn: 'selectionChange'
            });
        }
    }
    selectionChange(){
        if(typeof this.appVm[this.selectionChangeFn] === 'function') {
            this.appVm[this.selectionChangeFn](this.getSelection());
        } 
    }
    event(){
        var self = this;
        // 批量删除
        self.$del.on('click', function(){
            self.getSelection();
            if(!self.selection.length) return _sv.errorTip('请选择需要删除的数据！');
            // 调取父组件删除方法
            if(typeof self.appVm[self.deleteFn] === 'function') {
                self.appVm[self.deleteFn](self.selection);
            } 
        });
        // 刷新
        self.$reload.on('click', function(){
            self.reload();
        });
    }
    getSelection(){
        this.selection = [];
        var $tr = this.$con.find(':checked').parents('tr[data-row]');
        for(var i=0; i<$tr.length; i++){
            var row = $tr.eq(i).attr('data-row');
            row = (typeof row === 'string') ? JSON.parse(row) : row;
            this.selection.push(row);
        }
        return this.selection;
    }
    reload(){
        this.loadData();
        this.render();
    }

    // api扩展
    apiExtend(){
        var self = this;

        // 获取选中项
        this.api.getSelection = function(){
            return self.getSelection();
        };
        // 获取处理后的列数据
        this.api.getInnerColumns = function(){
            return self.innerColumns;
        };
        // 刷新数据
        this.api.reload = function(){
            // console.log('reload');
            self.reload();
        };
        // 刷新列
        this.api.reloadColumns = function(){
            self.initColumns();
            self.render();
        };
    }
}

export default Table;