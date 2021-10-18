import { def } from './utils.js';

// 得到Array.prototype
const arrayPrototype = Array.prototype;

// 以Array.prototype为原型,创建arrayMethods对象,并暴露出去
export const arrayMethods = Object.create(arrayPrototype);

// 要被改写的七个数组方法
const methodsNeedChange = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reserve'
];

methodsNeedChange.forEach(methodsName => {
  // 备份原来的方法,因为push,pop等七个函数的功能不能被剥夺
  const original = arrayPrototype[methodsName];

  // 定义新的方法
  def(
    arrayMethods,
    methodsName,
    function () {
      // 恢复原来的功能
      const result = original.apply(this, arguments);

      // 把类数组对象变为数组
      const args = [...arguments];

      // 把这个数组身上的__ob__取出来,__ob__已经被添加了,为什么已经被添加了?因为数组肯定不是最高层,比如obj.g属性是数组,obj不能是数组,第一次遍历obj这个对象的第一层的时候,已经给g属性(就是这个数组)添加了__ob__属性
      const ob = this.__ob__;

      // 有三种方法push/unshift/splice能够插入新项,现在要把插入的新项也要变为observe的
      let inserted = [];

      switch (methodsName) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          // splice格式是splice(下标,数量,插入的新项)
          inserted = args.slice(2);
          break;
      }
      // 判断有没有要插入的新项,让新项也变为响应的
      if (inserted) {
        ob.observeArray(inserted);
      }

      // console.log('aaaaaaaa');

      ob.dep.notify();

      return result;
    },
    false
  );
});
