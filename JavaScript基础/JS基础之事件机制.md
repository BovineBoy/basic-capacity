# JS基础之事件机制

```javascript
async function async1() {
  console.log('async1 start')

  await async2()

  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(() => console.log('setTimeout'), 0)

async1()

new Promise(resolve => {
  console.log('promise1')

  resolve()
}).then(() => console.log('promise2'))

console.log('script end')
```

首先分析JS异步微任务与宏任务

1. JS会在同步代码执行完成后才回去检查是否有异步任务完成，并执行对应的回调，而微任务又会在宏任务之前执行。

2. setTimeout、SetInterval都属于宏任务，promise属于微任务

3. `new Promise`在实例化过程中的代码是同步进行的，而`then`中注册的回调才是异步执行的

4. `async/await`本质上还是基于`Promise`的一些封装，而`Promise`是属于微任务的一种。所以在使用`await`关键字与`Promise.then`效果类似

5. `async`函数在`await`之前的代码都是同步执行的，可以理解为`await`之前的代码属于`new Promise`时传入的代码，`await`之后的所有代码都是在`Promise.then`中的回调

根据执行上下文分析一下上述代码执行顺序：

1. 进入`全局上下文`，JS开始执行，首先执行同步代码`console.log('script start')`，然后继续向下执行，因为setTimeout属于异步宏任务，所以会先跳过`setTimeout`执行`async1()`，然后`全局上下文`暂停执行，
创建`async1函数执行上下文`，`push`进`执行上下文栈`。

2. 开始执行`async1`函数，前面分析过`async`函数在`await`关键字之前的代码都是同步执行的，`await`关键字之后的代码才是异步执行。所以会先执行`console.log('async1 start')`，再执行`async2()`，此时`async1`函数暂停执行，创建`async2函数执行上下文`，`push`进`执行上下文栈`。

3. 开始执行`async2`函数，执行`console.log('async2')`，执行完毕后将`async2函数执行上下文` `pop`出`执行上下文栈`，接下来因为`await`之后代码是异步的，所以js会将下面的代码当做回调函数注册入`异步任务队列`，先执行其他同步任务，并将`async1`函数`pop`出`执行上下文栈`。

4. 在`全局执行上下文`执行同步代码`new Promise`实例化函数，`全局执行上下文`暂停执行，创建`promise实例化函数上下文`，并 `push`进`执行上下文栈`，执行`promise实例化函数`，打印`promise1`后，将`promise实例化函数上下文`pop出`执行上下文栈`，执行`resolve()`，因为`then`内回调函数异步，所以将回调函数放入`异步任务队列`，将`promise实例化函数上下文` `pop`出`执行上下文栈`。

5. 执行同步代码`console.log('script end')`

6. 执行完全部同步代码后，执行异步任务队列中的回调任务，按照顺序，先执行`console.log('async1 end')`，再执行`console.log('promise2')`，当然执行过程中还是熟悉的`执行上下文栈`操作。

7. 执行完异步微任务后执行异步宏任务，也就是`setTimeout`，输出`setTimeout`

至此，分析出的打印顺序为：

1. script start

2. async1 start

3. async2

4. promise1

5. script end

6. async1 end

7. promise2

8. setTimeout
