'use strict';

import Table from '@/components/table/table.js';

new Page({
    el: 'index',
    data: {
        table: {
            api: {},
            // autoLoad: false,
            showModifyBtn: false,
            deleteFn: 'delete',
            loadDataFn: 'loadData',
            selectionChangeFn: 'selectionChange',
            columns: [
                { field: 'checkbox' },
                { field: 'code', title: '代码' },
                { field: 'name', title: '名称' },
                { field: 'status', title: '状态', cellTemplate: '<span>{{row.status|enumeration bill_status}}</span>' },
                { field: 'channel.name', title: '组织' },
                { field: 'createTime', title: '创建时间', cellTemplate: '<span>{{row.createTime|dateFormat}}</span>' },
                {
                    field: 'action', title: '操作', visible: true, cellTemplate: 
                        '<button class="btn btn-link row-delete">删除</button>\
                        <button class="btn btn-link row-edit">编辑</button>'
                },
            ],
            // listData:[]
        }
    },
    init : function(){
        // 渲染表格
        new Table(Object.assign({
            appVm: this
        }, this.data.table));
        // 加载事件
        this.event();
    },
    event : function(){
        var self = this;
        // 删除
        $('#table').on('click', '.row-delete', function(event){
            // event.stopPropogation();
            var $tr = $(this).parents('tr[data-row]');
            var row = $tr.attr('data-row');
            row = (typeof row === 'string') ? JSON.parse(row) : row;
            self.delete(row);
        });
    },
    delete : function(row){
        if(!_util.isArray(row)) row = [row];
        var ids = _util.array.select(row, 'id');
        console.log(ids);

        // 异步请求

        // 刷新表格
        this.data.table.api.reload();
    },
    selectionChange : function(selection){
        console.log(selection);
    },
    loadData : function(){
        // 异步请求
        var ret =  [
            {
                "id":"01",
                "code":"code1",
                "name":"名称1",
                "channel":{
                    "name":"组织1"
                },
                "status":"0",
                "createTime":"2019-03-18 14:08:39"
            },
            {
                "id":"02",
                "code":"code2",
                "name":"名称2",
                "channel":{
                    "name":"组织2"
                },
                "status":"1",
                "createTime":"2018-12-21 11:23:51"
            },
            {
                "id":"03",
                "code":"code3",
                "name":"名称3",
                "channel":{
                    "name":"组织3"
                },
                "status":"2",
                "createTime":"2018-11-12 11:24:49"
            }
        ];

        return ret;
    }
});
