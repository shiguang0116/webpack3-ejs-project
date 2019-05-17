/**
 * @description: 主入口文件，该文件下的所有引用文件最后会被打包成 main.js 和 main.css
 * @author: guang.shi <https://blog.csdn.net/guang_s>
 * @date: 2018-01-09 13:39:34
 */

// 第三方css库
import 'bootstrap/dist/css/bootstrap.min.css'

// 第三方js库
import 'jquery'
import 'bootstrap'
import 'art-template/lib/template-web.js' // 客户端模板渲染
import '@babel/polyfill' // 编译es6新增api

// 改变template模板（客户端）原生语法解析规则，避免和ejs模板语法（服务端）冲突
var rule = template.defaults.rules[0]
rule.test = new RegExp(rule.test.source.replace('<%', '<\\\?').replace('%>', '\\\?>'))

// 引入页面css
import './styles/main.less'

// 页面公用js类
import '@/utils/util.js'
import '@/utils/service.js'
import '@/utils/filter.js'
import '@/common/header/header.js'
import '@/common/footer/footer.js'

// 全局引入组件（如果想单独引用，在对应的页面js引入即可）
import '@/components/empty/empty.js'
