# JS基础复习之面向对象

## 什么是面向对象？

> 万事万物皆对象。面向对象的思想主要是以对象为主，将一个问题抽象出具体的对象，并且将抽象出来的对象和对象的属性和方法封装成一个类

## 面向对象和面向过程的区别

- 面向对象和面向过程并不是完全相对的，也并不是完全独立的

- 面向过程主要以动词为主，解决问题的方式是按照顺序一步一步调用不同的函数

- 面向对象以名字为主，将问题抽象出具体的对象，这个对象有自己的属性和方法， 解决问题时将不同的对象组合在一起使用

- 面向对象可扩展性强，解决了代码重用性的问题

例子1：经典回顾`把🐘装进冰箱`

面向过程：
1. 开门(冰箱)
2. 装进(冰箱, 🐘)
3. 关门(冰箱)

面向对象

1. 冰箱.开门()
2. 冰箱.装进(🐘)
3. 冰箱.关门()


可以看出来面向对象和面向过程的侧重点是不同的，面向过程是以`动词`为主，完成一个事件就是将不同的动作函数按顺序调用。
面向对象是以`主谓`为主。将主谓看成一个一个的对象，然后对象有自己的属性和方法。比如说，冰箱有自己的id属性，有开门的方法。然后就可以直接调用冰箱的开门方法给其传入一个参数大象就可以了。

例子2：五子棋

面向过程的设计思路是分析问题的步骤：
1. 开始游戏
2. 黑子先走
3. 绘制画面
4. 判断输赢
5. 轮到白子
6. 绘制画面
7. 判断输赢
8. 返回步骤2

面向对象设计思路是将整个五子棋系统分为：
1. 黑白双方，行为一致
2. 棋盘系统，负责绘制画面
3. 规则系统，判断输赢

功能上的统一保证了面向对象设计的可扩展性：

- 比如要加入悔棋的功能，如果要改动面向过程的设计，那么从输入到判断到显示这一连串的步骤都要改动，甚至步骤之间的循序都要进行大规模调整。如果是面向对象的话，只用改动棋盘对象就行了，棋盘系统保存了黑白双方的棋谱，简单回溯就可以了，而显示和规则判断则不用顾及，同时整个对对象功能的调用顺序都没有变化，改动只是局部的

- 再比如要把这个五子棋游戏改为围棋游戏，如果是面向过程设计，那么五子棋的规则就分布在了程序的每一个角落，要改动还不如重写。但是如果当初就是面向对象的设计，那么只用改动规则对象就可以了，五子棋和围棋的区别不就是规则吗？而下棋的大致步骤从面向对象的角度来看没有任何变化

## 封装

面向对象三大特性是封装、继承、多态。

在ES5中，没有`class`这个概念，但是由于js的函数级作用域（`在函数内部的变量在函数外访问不到`），所以我们可以模拟`class`的效果。

在es5中，类其实就是保存了一个函数的变量，这个函数有自己的属性和方法。将属性和方法组成一个类的过程就是`封装`。

> 封装：把客观事物封装成抽象的类，隐藏属性和方法的实现细节，仅对外公开接口。

#### 通过构造函数添加

JavaScript提供了一个构造函数`constructor`模式，用来在`创建对象时初始化对象`。构造函数其实就是普通的函数，只不过有以下的特点：

- 首字母大写(建议构造函数首字母大写，即使用大驼峰命名，非构造函数首字母小写)

- 内部使用 `this`

- 使用 `new` 生成实例

通过构造函数添加属性和方法实际上也就是通过this添加的属性和方法。因为 `this` 总是指向当前对象的，所以通过 `this` 添加的属性和方法只在当前对象上添加，是该对象自身拥有的.所以我们实例化一个新对象的时候， `this` 指向的属性和方法都会得到相应的创建，也就是会在内存中复制一份，这样就造成了内存的浪费。

```javascript
function Cat(name, color) {
  this.name = name
  this.color = color
  this.eat = function() {
    alert("吃老鼠")
  }
}
```

生成实例:
```javascript
var tom = new Cat('Tom', 'blue')
```

**通过this定义的属性和方法，我们实例化对象的时候都会重新复制一份**

#### 通过原型prototype

因为在类上通过 `this` 的方式添加属性和对象会导致内存浪费的问题，所以考虑让实例化的类所使用的方法直接使用`指针`指向同一个方法。

> Javascript规定，每一个构造函数都有一个 `prototype` 属性，指向另一个对象。这个对象的所有属性和方法，都会被构造函数的实例继承。
>也就是说，对于那些不变的属性和方法，我们可以直接将其添加在类的 `prototype` 对象上。

```javascript
function Cat(name, color) {
  this.name = name
  this.color = color
}

Cat.prototype.type = "猫科动物"
Cat.prototype.eat = function() {
  alert("吃老鼠")
}
```

生成实例：

```javascript
var tom = new Cat('Tom', 'blue')
var jerry = new Cat('Jerry', 'grown')
console.log(tom.type)   // 猫科动物
console.log(jerry.type) // 猫科动物
```

这时所有实例的 `type` 属性和 `eat()` 方法，其实都是同一个内存地址，指向 `prototype` 对象，因此就提高了运行效率。


#### 在类的外部通过.语法添加

我们还可以在类的外部通过 `. ` 语法进行添加，因为在实例化对象的时候，并不会执行到在类外部通过 `. ` 语法添加的属性，所以实例化之后的对象是不能访问到 `. ` 语法所添加的对象和属性的，只能通过该类访问。


###三者的区别

通过构造函数、原型和 `. ` 语法三者都可以在类上添加属性和方法。但是三者是有一定的区别的。
**构造函数**：通过this添加的属性和方法总是指向当前对象的，所以在实例化的时候，通过this添加的属性和方法都会在内存中复制一份，这样就会造成内存的浪费。但是这样创建的好处是即使改变了某一个对象的属性或方法，不会影响其他的对象（因为每一个对象都是复制的一份）。
**原型**：通过原型继承的方法并不是自身的，我们要在原型链上一层一层的查找，这样创建的好处是只在内存中创建一次，实例化的对象都会指向这个 `prototype` 对象，但是这样做也有弊端，因为实例化的对象的原型都是指向同一内存地址，改动其中的一个对象的属性可能会影响到其他的对象。
**. 语法**：在类的外部通过 `. ` 语法创建的属性和方法只会创建一次，但是这样创建的实例化的对象是访问不到的，只能通过类的自身访问。

#### JavaScript实现关键字

##### 关键字概念

- **public**： 表明该数据成员、成员函数是对所有用户开放的，所有用户可以直接调用

- **private**：表示除了class自己以外，谁都不可调用

- **protected**：表示对于子女、朋友public，对于外部class则是private

##### JavaScript实现

- **private**：因为javascript函数级作用域的特性（在函数中定义的属性和方法外界访问不到），所以我们在函数内部直接定义的属性和方法都是私有的。

- **public**：通过 `new` 关键词实例化时，this定义的属性和变量都会被复制一遍，所以通过this定义的属性和方法就是公有的。
通过 `prototype` 创建的属性在类的实例化之后类的实例化对象也是可以访问到的，所以也是公有的。

- **protected**：在函数的内部，我们可以通过 `this` 定义的方法访问到一些类的私有属性和方法，在实例化的时候就可以初始化对象的一些属性了。

#### new实质

通过例子`var instance = new Foo()`解析：

1. 新建一个对象`instance`

2. `instance.__proto__ = Foo.prototype`，将新创建对象的`__proto__`属性指向构造函数的`prototype`属性

3. 将`this`指向新创建的对象`instance`

4. 返回新对象，但是这里需要看构造函数有没有返回值，如果构造函数的返回值为基本数据类型为 `string, boolean, number, null, undefined`,  那么就返回新对象，如果构造函数的返回值为对象类型，那么就返回这个对象类型

栗子：

```javascript
var Book = function(id, name, price) {
  // private(在函数内部定义，函数外部访问不到，实例化之后实例化的对象访问不到)
  var num = 1
  var id = id
  function checkId() {
    console.log('private')
  }
  // protected(可以访问到函数内部的私有属性和私有方法，在实例化之后就可以对实例化的类进行初始化拿到函数的私有属性)
  this.getName = function() {
    console.log(name)
  }

  this.getPrice = function() {
    console.log(price)
  }

  // public(实例化的之后，实例化的对象就可以访问到)
  this.name = name
  this.copy = function() {
    console.log('this is a public')
  }
}

// 在Book原型上添加的方法实例化之后可以被实例化对象继承
Book.prototype.foo = function() {
  console.log('bar')
}

// 在函数外部通过.语法创建的属性和方法，只能通过该类来访问，实例化对象访问不到
Book.bar = function() {
  console.log('foo')
}


var book = new Book('1', '钢铁是怎样炼成的', '￥99')

book.getName() // 钢铁是怎样炼成的 getName是protected，可以访问到类的私有属性，所以实例化之后也可以访问到函数的私有属性

book.checkId() // 报错book.checkId is not a function

console.log(book.id)   // undefined id是在函数内部通过定义的，是私有属性，所以实例化对象访问不到

console.log(book.name) //name 是通过this创建的，所以在实例化的时候会在book1中复制一遍name属性，所以可以访问到

book.copy() // this is public

book.foo() // bar

Book.bar() // foo

book.bar() // 报错book.bar is not a function
```


## 继承

### 什么是继承
> 子类可以使用父类的所有功能，并且对这些功能进行扩展。继承的过程，就是从一般到特殊的过程。

### 继承的方式

##### 类式继承

所谓的类式继承就是使用的原型的方式，将方法添加在父类的原型上，然后子类的原型是父类的一个实例化对象。

```javascript
// 声明父类
var SuperClass = function() {
  var id = 1
  this.name = ['javascript']
  this.superValue = function() {
    console.log('superValue')
    console.log(id)
  }
}

// 为父类添加公共方法
SuperClass.prototype.getSuperValue = function() {
  this.superValue()
}

// 声明子类
var SubClass = function() {
  this.subValue = function() {
    console.log('subValue')
  }
}

// 子类继承父类
SubClass.prototype = new superClass()

SubClass.prototype.getSubValue = function() {
  this.subValue()
}

var sub = new SubClass()
var sub2 =  new  SubClass()

sub.getSuperValue()   // superValue
sub.getSubValue()     // subValue

console.log(sub.id)    // undefined
console.log(sub.name)  // ['javascript']

sub.name.push('java')  // ["java"]
console.log(sub2.name)  // ["javascript", "java"]
```

其中最核心的一句代码是 `SubClass.prototype = new SuperClass()`
类的原型对象 `prototype` 对象的作用就是为类的原型添加共有方法的，但是类不能直接访问这些方法，只有将类实例化之后，新创建的对象复制了父类构造函数中的属性和方法，并将原型 `__proto__` 指向了父类的原型对象。这样子类就可以访问父类的 `public` 和 `protected` 的属性和方法，同时，父类中的 `private` 的属性和方法不会被子类继承。

缺陷： 使用类继承的方法，如果父类的构造函数中有引用类型，就会在子类中被所有实例共用，因此一个子类的实例如果更改了这个引用类型，就会影响到其他子类的实例。

##### 构造函数继承

构造函数继承的核心思想就是 `SuperClass.call(this, id)` ,直接改变this的指向，使通过this创建的属性和方法在子类中复制一份，因为是单独复制的，所以各个实例化的子类互不影响。但是会造成内存浪费的问题。

```javascript
//构造函数继承
//声明父类
function SuperClass(id) {
    var name = 'javascript'
    this.books = ['javascript','html','css']
    this.id = id
}

//声明父类原型方法
SuperClass.prototype.showBooks = function() {
    console.log(this.books)
}

//声明子类
function SubClass(id) {
    SuperClass.call(this, id)
}

//创建第一个子类实例
var subclass1 = new SubClass(10)
var subclass2 = new SubClass(11)

console.log(subclass1.books)
console.log(subclass2.id)
console.log(subclass1.name)  //undefined
subclass2.showBooks()
```

##### 组合式继承

|  | 类继承 | 构造函数继承 |
| :-- | :--| :-- |
| 核心思想 | 子类的原型是父类实例化的对象 | SuperClass.call(this,id) |
| 优点 | 子类实例化对象的属性和方法都指向父类的原型 | 每个实例化的子类互不影响 |
| 缺点 | 子类之间可能会互相影响 | 内存浪费 |


组合式继承汲取两者的优点，即避免了内存浪费，又使得每个实例化的子类互不影响。

```javascript
//组合式继承
//声明父类
var SuperClass = function (name) {
    this.name = name
    this.books=['javascript','html','css']
}

//声明父类原型上的方法
SuperClass.prototype.showBooks = function() {
    console.log(this.books)
}

//声明子类
var SubClass = function name) {
    SuperClass.call(this, name)
}

//子类继承父类（链式继承）
SubClass.prototype = new SuperClass()

//实例化子类
var subclass1 = new SubClass('java')
var subclass2 = new SubClass('php')
subclass2.showBooks()
subclass1.books.push('ios')  // ["javascript", "html", "css"]
console.log(subclass1.books) // ["javascript", "html", "css", "ios"]
console.log(subclass2.books) // ["javascript", "html", "css"]
```

缺陷：父类的构造函数会被创建两次（call()的时候一遍，new的时候又一遍）

##### 寄生组合继承

在类继承中我们并不需要创建父类的构造函数，我们只是要子类继承父类的原型即可。所以可以先给父类的原型创建一个副本，然后修改子类constructor属性，最后在设置子类的原型就可以了

```javascript
//原型式继承
//原型式继承其实就是类式继承的封装,实现的功能是返回一个实例，改实例的原型继承了传入的o对象
function inheritObject(o) {
    //声明一个过渡函数对象
    function F() {}
    //过渡对象的原型继承父对象
    F.prototype = o;
    //返回一个过渡对象的实例，该实例的原型继承了父对象
    return new F();
}
//寄生式继承
//寄生式继承就是对原型继承的第二次封装，使得子类的原型等于父类的原型。并且在第二次封装的过程中对继承的对象进行了扩展
function inheritPrototype(subClass, superClass){
    //复制一份父类的原型保存在变量中，使得p的原型等于父类的原型
    var p = inheritObject(superClass.prototype);
    //修正因为重写子类原型导致子类constructor属性被修改
    p.constructor = subClass;
    //设置子类的原型
    subClass.prototype = p;
}
//定义父类
var SuperClass = function (name) {
    this.name = name;
    this.books = ['javascript','html','css']
};
//定义父类原型方法
SuperClass.prototype.getBooks = function () {
    console.log(this.books)
};

//定义子类
var SubClass = function (name) {
    SuperClass.call(this,name)
}

inheritPrototype(SubClass,SuperClass);

var subclass1 = new SubClass('php')
```

