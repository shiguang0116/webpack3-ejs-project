'use strict';
import env from 'build/env.js';

(function(){
    const util = {
        // 处理页脚
        handleFooter : function(obj1,obj2,pd,h) { // obj: DOM对象  h: number
            var h = h || 0;
            var sh = document.documentElement.clientHeight; //页面对象高度（即BODY对象高度加上Margin高）
            obj1.style.minHeight = (sh - h) + 'px'; 
            obj1.style.position = 'relative'; 
            obj1.style.paddingBottom = pd + 'px'; 
            obj2.style.position = 'absolute'; 
            obj2.style.bottom = '0'; 
            obj2.style.display = 'block'; 
        }
    };
    window.util = util;
})();