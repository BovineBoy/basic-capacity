# JS基础之this绑定

this的绑定规则一共有以下五种：

1. 默认绑定(严格/非严格 模式)

2. 隐式绑定

3. 显示绑定

4. new构造函数绑定

5. 箭头函数绑定

## 绑定规则

### 默认绑定

1.非严格模式下，this指向`全局对象`

```javascript
var a = 2;

function foo() {
    console.log(this.a) //
}

foo() // 2
```

2.严格模式下，this绑定`undefined`

```javascript
var a = 2;

function foo() {
    "use strict"
    console.log(this.a) //
}

foo() // Uncaught TypeError: Cannot read property 'a' of undefined
```

### 隐式绑定

当函数引用有`上下文对象`时，this会绑定到这个`上下文对象`上

```javascript
function foo(){
    console.log(this.a);
}

var obj = {
    a: 2,
    foo: foo
};

obj.foo(); // 2
```

> 隐式丢失

- 被隐式绑定的函数特定情况下会丢失绑定对象，应用默认绑定，把this绑定到全局对象或者undefined上。

```javascript
// 虽然bar是obj.foo的一个引用，但是实际上，它引用的是foo函数本身。
// bar()是一个不带任何修饰的函数调用，应用默认绑定。
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

var bar = obj.foo; // 函数别名

var a = "oops, global"; // a是全局对象的属性

bar(); // "oops, global"
```

- 参数传递就是一种隐式赋值，传入函数时也会被隐式赋值。回调函数丢失this绑定是非常常见的。

```javascript
function foo() {
    console.log( this.a );
}

function doFoo(fn) {
    // fn其实引用的是foo

    fn(); // <-- 调用位置！
}

var obj = {
    a: 2,
    foo: foo
};

var a = "oops, global"; // a是全局对象的属性

doFoo( obj.foo ); // "oops, global"
```

### 显示绑定

通过call(..)/bind(..) 或者 apply(..)方法。第一个参数是一个对象，在调用函数时将这个对象绑定到this。因为直接指定this的绑定对象，称之为显示绑定。

```javascript
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2
};

foo.call( obj ); // 2  调用foo时强制把foo的this绑定到obj上
```

显示绑定方法在方法内部改变`this`指向到`传入的对象`

### new构造函数绑定

- 在JS中，构造函数只是使用new操作符时被调用的普通函数，他们不属于某个类，也不会实例化一个类。
- 包括内置对象函数（比如Number(..)）在内的所有函数都可以用new来调用，这种函数调用被称为构造函数调用。
- 实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”。
- this总是指向调用该函数的对象。

使用new来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

1、创建（或者说构造）一个新对象。
2、这个新对象会被执行`Prototype`连接。
3、这个新对象会绑定到函数调用的this。
4、如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。

手写new实现：

```javascript
function create() {
   // 创建一个空的对象
    var obj = new Object(),
    // 获得构造函数，arguments中去除第一个参数
    Con = [].shift.call(arguments);
    // 链接到原型，obj 可以访问到构造函数原型中的属性
    obj.__proto__ = Con.prototype;
    // 绑定 this 实现继承，obj 可以访问到构造函数中的属性
    var ret = Con.apply(obj, arguments);
    // 优先返回构造函数返回的对象
    return ret instanceof Object ? ret : obj;
};
```

代码原理解析：

1、用`new Object()`的方式新建了一个对象`obj`

2、取出第一个参数，就是我们要传入的构造函数。此外因为shift会修改原数组，所以`arguments`会被去除第一个参数

3、将`obj`的原型指向构造函数，这样`obj`就可以访问到构造函数原型中的属性

4、使用`apply`，改变构造函数`this`的指向到新建的对象，这样`obj`就可以访问到构造函数中的属性

5、返回`obj`

优先级：new构造函数绑定 ---> 显示绑定 ---> 隐式绑定 --->默认绑定

### 箭头函数绑定

ES6新增一种特殊函数类型：箭头函数，箭头函数无法使用上述四条规则，而是根据外层（函数或者全局）作用域 **（词法作用域）** 来决定this。

- `foo()`内部创建的箭头函数会捕获调用时`foo()`的this。由于`foo()`的this绑定到`obj1`，`bar`(引用箭头函数)的this也会绑定到`obj1`，箭头函数的绑定无法被修改(`new`也不行)。

```javascript
function foo() {
    // 返回一个箭头函数
    return (a) => {
        // this继承自foo()
        console.log( this.a );
    };
}

var obj1 = {
    a: 2
};

var obj2 = {
    a: 3
}

var bar = foo.call( obj1 );
bar.call( obj2 ); // 2
```

箭头函数的this：

- 箭头函数不绑定this，箭头函数中的this相当于普通变量。

- 箭头函数的this寻值行为与普通变量相同，在作用域中逐级寻找。

- 箭头函数的this无法通过bind，call，apply来直接修改（可以间接修改）。

- 改变作用域中this的指向可以改变箭头函数的this。

- eg. function closure(){()=>{//code }}，在此例中，我们通过改变封包环境closure.bind(another)()，来改变箭头函数this的指向。
