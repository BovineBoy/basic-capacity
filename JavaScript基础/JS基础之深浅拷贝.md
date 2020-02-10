# JS基础复习之深浅拷贝

## 赋值、浅拷贝、深拷贝的区别

### 一、赋值(copy)

赋值是将某一数值或对象赋给某个变量的过程，分为下面 2 部分

- 基本数据类型：赋值，赋值之后两个变量互不影响
- 引用数据类型：赋**址**，两个变量具有相同的引用，指向同一个对象，相互之间有影响

### 二、浅拷贝(shallow copy)

创建一个新对象`(targetObj)`，这个对象有着原始对象`(sourceObj)`属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。

简单来说就是`浅拷贝只解决原始对象第一层的问题，拷贝第一层的基本类型值，以及第一层的引用类型地址`。

#### 使用场景
##### Object.assign()

`Object.assign()`方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
##### 展开语法Spread
##### Array.prototype.slice()
`slice()`方法返回一个新的数组对象，这一对象是一个由 begin和 end（不包括end）决定的原数组的浅拷贝。原始数组不会被改变。

### 三、深拷贝(deep copy)

深拷贝会拷贝所有的属性，并`拷贝属性指向的动态分配的内存`。当对象和它所引用的对象一起拷贝时即发生深拷贝。深拷贝相比于浅拷贝速度较慢并且花销较大。拷贝前后两个对象`互不影响`。

#### 使用场景
##### JSON.parse(JSON.stringify(object))
缺陷：
1. 会忽略 undefined
1. 会忽略 symbol
1. 不能序列化函数
1. 不能解决循环引用的对象
1. 不能正确处理`new Date()`
1. 不能处理正则

- undefined、symbol 和函数这三种情况，会直接忽略

```javascript
let obj = {
    name: 'bovine',
    a: undefined,
    b: Symbol('bovine'),
    c: function() {}
}
console.log(obj);
// {
// 	name: "bovine", 
// 	a: undefined, 
//  b: Symbol(bovine), 
//  c: ƒ ()
// }

let b = JSON.parse(JSON.stringify(obj));
console.log(b);
// {name: "bovine"}
```

- 循环引用情况下，会报错

```javascript
let obj = {
    a: 1,
    b: {
      c: 2,
      d: 3
    }
}
obj.a = obj.b;
obj.b.c = obj.a;

let b = JSON.parse(JSON.stringify(obj));
// Uncaught TypeError: Converting circular structure to JSON
```

- `new Date` 情况下，转换结果不正确(解决方法: 转成字符串或者时间戳)

```javascript
new Date();
// Mon Dec 24 2018 10:59:14 GMT+0800 (China Standard Time)

JSON.stringify(new Date());
// ""2018-12-24T02:59:25.776Z""

JSON.parse(JSON.stringify(new Date()));
// "2018-12-24T02:59:41.523Z"
```

- 正则情况下

```javascript
let obj = {
    name: "bovine",
    a: /'123'/
}
console.log(obj);
// {name: "bovine", a: /'123'/}

let b = JSON.parse(JSON.stringify(obj));
console.log(b);
// {name: "bovine", a: {}}

```


### 浅拷贝实现

```javascript
function shallowClone(source) {
    var target = {};
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
    return target;
}
```


### 深拷贝实现

```javascript
function deepClone(source) {
    var target = {};
    for(var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (typeof source[key] === 'object') {
                target[key] = deepClone(source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}
```