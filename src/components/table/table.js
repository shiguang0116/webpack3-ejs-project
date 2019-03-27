/**
 * @description: table组件
 * @author: guang.shi <https://blog.csdn.net/guang_s> 
 * @date: 2019-03-27 12:53:43 
 */
'use strict';

import './table.less';

class Table {
    constructor (option) {
        // 初始化参数
        option = option || {};
        this.appVm = option.appVm || {};
        this.el = option.el || 'table';
        this.autoLoad = option.autoLoad === undefined ? true : option.autoLoad;
        this.showDeleteBtn = option.showDeleteBtn === undefined ? true : option.showDeleteBtn;
        this.showModifyBtn = option.showModifyBtn === undefined ? true : option.showModifyBtn;
        this.showReloadBtn = option.showReloadBtn === undefined ? true : option.showReloadBtn;
        this.delete = option.delete || 'delete';
        this.loadData = option.loadData || 'loadData';
        this.columns = option.columns || [];
        this.listData = option.listData || [];
        this.selection = [];
        // 其他
        this.actionId = this.el + '_action';
        this.conId = this.el + '_con';
        this.tplId = this.el + '_tpl';
        // 初始化操作按钮
        this.$action = $('#' + this.actionId);
        this.$del = this.$action.find('button[name="delete"]');
        this.$edit = this.$action.find('button[name="edit"]');
        this.$reload = this.$action.find('button[name="reload"]');
        if(!this.showDeleteBtn) this.$del.hide();
        if(!this.showModifyBtn) this.$edit.hide();
        if(!this.showReloadBtn) this.$reload.hide();
        // 加载数据
        if(this.autoLoad) this.loader();
        this.initColumns();
        this.render();
        this.event();
    }
    loader() {
        // promise
        var ret = this.appVm[this.loadData]();
        if(_util.isArray(ret)) this.listData = ret;
        else{
            this.listData = ret.listData || [];
            // 扩展列
            this.columns = ret.columns || this.columns;
        }
    }
    initColumns() {
        if(this.columns.length == 0) return;

        _util.forEach(this.columns, function(i, item){
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
            columns: this.columns,
            listData: this.listData
        };
        var html = template(this.tplId, data);
        $('#' + this.conId).html(html);
        // 处理复选框
        var $all = $('#' + this.el).find('input[name="checkAll"]');
        if($all.length) this.checkAll({ id: this.conId });
    }
    checkAll(param){
        var id = param.id || '';
        var $p = $('#'+id);
        var $all = $p.find('input[name="checkAll"]');
        var $one = $p.find('input[name="checkOne"]');
        // 点击全选，选择所有项
        $all.on('click', function(){
            $one.prop('checked', this.checked);
        });
        // 点击复选框，判断是否全选
        $one.on('click', function(){
            $all.prop("checked" , $one.length == $one.filter(":checked").length ? true : false); 
        });
    }
    getSelection(){
        this.selection = [];
        var $tr = $(':checked').parents('tr[data-row]');
        for(var i=0; i<$tr.length; i++){
            var row = $tr.eq(i).attr('data-row');
            row = (typeof row === 'string') ? JSON.parse(row) : row;
            this.selection.push(row);
        }
        return this.selection;
    }
    event(){
        var self = this;
        // 批量删除
        self.$del.on('click', function(){
            self.getSelection();
            if(!self.selection.length) return _sv.errorTip('请选择需要删除的数据！');
            // 调取父组件删除方法
            self.appVm[self.delete](self.selection);
        });
        // 刷新
        self.$reload.on('click', function(){
            self.reload();
        });
    }
    reload(){
        this.loader();
        this.render();
    }
    reloadColumns(){
        this.initColumns();
        this.render();
    }
}

export default Table;