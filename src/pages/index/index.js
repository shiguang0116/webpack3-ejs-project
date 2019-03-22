'use strict';

new Page({
    el: 'index',
    data: {
        
    },
    init : function(){
        console.log(this.data);
    },
    event : function(){
        $('#click').click(function(){
            alert('clickEvent');
        });
    },
    queryPage : function(){
        
    },
});
