# 深入JS作用域与闭包复习

## 什么是闭包

>闭包是指有权访问另外一个函数作用域中的变量的函数

1.特点：

- 是一个函数
- 能够访问另一个函数作用域中的变量

2.特性：

- 闭包可以访问当前函数以外的变量

```javascript
function getOuter() {
  var date = '206';
  function getDate(str){
    console.log(str + date);  //访问外部的date
  }
  return getDate('今天是：'); //"今天是：206"
}
getOuter();
```

- 闭包能够访问已返回的外部函数的变量

```javascript
function getOuter() {
  var date = '206';
  function getDate(str){
    console.log(str + date);  //访问外部的date
  }
  return getDate;     //外部函数返回
}
var today = getOuter();
today('今天是：');   //"今天是：206"
today('明天不是：');   //"明天不是：206"
```

- 闭包可以更新外部变量的值

```javascript
function updateCount() {
  var count = 0;
  function getCount(val){
    count = val;
    console.log(count);
  }
  return getCount;     //外部函数返回
}
var count = updateCount();
count(206); //206
count(207); //207
```

正常情况下我们是无法在外部访问函数内部的变量的，闭包能够访问是因为`作用域链`的原因

## 什么是作用域链

> 当访问一个变量时，解释器会首先在当前作用域查找标示符，如果没有找到，就去父作用域找，直到找到该变量的标示符或者不在父作用域中，这就是作用域链。

作用域链和原型继承有点类似，但又有点小区别：如果去查找一个普通对象的属性时，在当前对象和其原型中都找不到时，会返回undefined；但查找的属性在作用域链中不存在的话就会抛出ReferenceError(引用错误)。

作用域链的顶端是`全局对象`。对于全局环境中的代码，作用域链只包含一个元素：全局对象。所以，在全局环境中定义变量的时候，它们就会被定义到全局对象中。当函数被调用的时候，作用域链就会包含多个作用域对象。
