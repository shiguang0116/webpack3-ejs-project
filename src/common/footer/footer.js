'use strict';
import './footer.less';

// 通用页面尾部
const footer = {
    init : function(){
        this.handleFooter();
    },
    handleFooter : function(){
        const oFoot = document.getElementById('footer');
        const oBody = document.getElementsByTagName('body')[0];
        _util.layout.fixedFooter(oBody,oFoot,64);
    }
};

$(function(){
    footer.init();
})