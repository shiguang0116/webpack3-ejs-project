(function() {
    // 仅在不支持 placeholder 的时候执行
    if (!('placeholder' in document.createElement('input'))) {
        var listenerName = 'attachEvent'
        var listenerPrefix = 'on'
        if ('addEventListener' in window) {
            listenerName = 'addEventListener'
            listenerPrefix = ''
        }

        window[listenerName](listenerPrefix + 'load', function() {
            var placeholderListener = {
                // 添加输入项
                add: function(tagName) {
                    var list = document.getElementsByTagName(tagName)
                    for (var i = 0; i < list.length; i++) {
                        this.render(list[i])
                    }
                    return this
                },
                // 渲染
                render: function(dom) {
                    var text = dom.getAttribute('placeholder')
                    if (text) {
                        this.attachEvent(dom, this.getDiv(dom, text))
                    }
                },
                // 设置样式
                getDiv: function(dom, text) {
                    var oParent = dom.parentNode
                    oParent.style.position ? '' : oParent.style.position = 'relative'

                    var div = document.createElement('div')
                    div.style.position = 'absolute'
                    div.style.width = this.getPosition(dom, 'Width') + 'px'
                    div.style.height = this.getPosition(dom, 'Height') + 'px'
                    div.style.left = this.getPosition(dom, 'Left') + 'px'
                    div.style.top = this.getPosition(dom, 'Top') + 'px'
                    div.style.color = '#999'
                    div.style.textIndent = '10px'
                    div.style.zIndex = 999
                    div.style.background = 'transparent'
                    div.style.cursor = 'text'
                    div.innerHTML = text

                    if (dom.tagName.toUpperCase() === 'TEXTAREA') {
                        div.style.lineHeight = '35px'
                    }
                    else {
                        div.style.lineHeight = div.style.height
                    }
                    oParent.appendChild(div)
                    return div
                },
                // 计算当前输入项目的位置
                getPosition: function(dom, name) {
                    var offsetName = 'offset' + name
                    var offsetVal = dom[offsetName]
                    return offsetVal
                },
                // 添加事件
                attachEvent: function(dom, div) {
                    // 激活时，隐藏 placeholder
                    dom[listenerName](listenerPrefix + 'focus', function() {
                        div.style.display = 'none'
                    })
                    // 失去焦点时，隐藏 placeholder
                    dom[listenerName](listenerPrefix + 'blur', function(e) {
                        var obj = e.srcElement ? e.srcElement : e.target
                        if (obj.value === '') {
                            div.style.display = ''
                        }
                    })
                    // placeholder 点击时，对应的输入框激活
                    div[listenerName](listenerPrefix + 'click', function() {
                        dom.focus()
                    })
                }
            }

            placeholderListener.add('input').add('textarea')
        })
    }
})()
