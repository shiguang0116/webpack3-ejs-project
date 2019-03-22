/**
 * @description: 主入口文件，该文件下的所有引用文件最后会被打包成 main.js 和 main.css
 * @author: guang.shi <https://blog.csdn.net/guang_s> 
 * @date: 2018-01-09 13:39:34 
 */

// 引入css
import './styles/main.less';

// 引入公用js
import '@/utils/util.js';
import '@/common/header/header.js';
import '@/common/footer/footer.js';

// 全局引入组件（如果想单独引用，在对应的页面js引入即可）
import '@/components/empty/empty.js';

// 页面实例
function Page(){
    this.init();
}