'use strict';

import './footer.less';

new Page({
    el: 'footer',
    data: {
        
    },
    init : function(){
        this.fixedFooter();
    },
    fixedFooter : function(){
        const oFoot = document.getElementById('footer');
        const oBody = document.getElementsByTagName('body')[0];
        _util.layout.fixedFooter(oBody,oFoot,64);
    }
});