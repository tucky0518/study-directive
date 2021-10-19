import Watcher from './Watcher.js';

export default class Compile {
  constructor(el, vue) {
    // vue实例
    this.$vue = vue;
    // 挂载点
    this.$el = document.querySelector(el);
    // 如果用户传入了挂载点
    if (this.$el) {
      // 调用函数，让节点变为fragment，类似于mustache中的tokens，实际上用的是AST，这里就是轻量级的，fragment
      let $fragment = this.node2Fragment(this.$el);
      // 编译
      this.compile($fragment);
      // 替换好的内容要上树
      this.$el.appendChild($fragment);
    }
  }

  node2Fragment(el) {
    // console.log(el);
    var fragment = document.createDocumentFragment();
    // console.log(fragment);
    var child;
    // 让所有dom节点，都进入fragment
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  }

  compile(el) {
    // console.log(el);
    // 得到子元素
    var childNodes = el.childNodes;
    var self = this;

    var reg = /\{\{(.*)\}\}/;

    childNodes.forEach(node => {
      var text = node.textContent;
      // console.log(text);
      if (node.nodeType == 1) {
        self.compileElement(node);
      } else if (node.nodeType == 3 && reg.test(text)) {
        // console.log('文本匹配');
        let name = text.match(reg)[1];
        self.compileText(node, name);
      }
    });
  }

  compileElement(node) {
    // console.log(node);
    // 这里的方便之处在于不是将HTML结构看成字符串，而是真正的属性列表
    var nodeAttrs = node.attributes;
    // console.log(nodeAttrs);
    var self = this;

    // 类数组对象变为数组
    // Array.prototype.slice.call(nodeAttrs).forEach(attr => {
    [].slice.call(nodeAttrs).forEach(attr => {
      // 这里就分析指令
      var attrName = attr.name;
      var value = attr.value;
      // 指令都是v-开头的
      var dir = attrName.substring(2);
      // console.log(dir);

      // 看看是不是指令
      if (attrName.indexOf('v-') == 0) {
        // v-开头的就是指令
        if (dir == 'model') {
          // console.log('发现了model指令', value);
          new Watcher(self.$vue, value, value => {
            node.value = value;
          });
          var v = self.getVueVal(self.$vue, value);
          node.value = v;
          // 添加监听
          node.addEventListener('input', e => {
            var newVal = e.target.value;
            self.setVueVal(self.$vue, value, newVal);
            v = newVal;
          });
        } else if (dir == 'if') {
          console.log('发现了if指令', value);
        }
      }
    });
  }

  compileText(node, name) {
    console.log(node, name);
    node.textContent = this.getVueVal(this.$vue, name.trim());
    new Watcher(this.$vue, name.trim(), value => {
      node.textContent = value;
    });
  }

  getVueVal(vue, exp) {
    var val = vue;
    exp = exp.split('.');
    exp.forEach(k => {
      val = val[k.trim()];
    });
    return val;
  }

  setVueVal(vue, exp, value) {
    var val = vue;
    exp = exp.split('.');
    exp.forEach((k, i) => {
      if (i < exp.length - 1) {
        val = val[k];
      } else {
        val[k] = value;
      }
    });
  }
}
