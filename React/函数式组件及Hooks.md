# React函数式组件及Hooks

## 什么是函数式组件

函数式组件又称为`无状态组件`，简单来说就是组件内部没有自己的`state`,组件状态修改完全依赖`props`和`context`

## 为什么要用函数式组件+Hook

1. 不用关心this的绑定，类组件可能会因为各种各样的情况出现this绑定不符合预期的情况，而在函数式组件中，无需对this进行操作。

2. Hook给予函数式组件很大的优势，它可以让函数组件拥有`state`和`生命周期`等React特性。

3. 因为无需编写class，省下了`创建类实例和在构造函数中绑定事件处理器的成本`，还可以使用`useMemo`以很小的代价进行组件更新，能更好的优化性能。

4. 使用Hook不需要很深的组件树嵌套，无需对this进行绑定，减小了工作量。

5. 自定义Hook使`组件复用`变得简单。

6. 类组件生命周期混乱容易写出BUG，而useEffect可以用较小的代价替换掉生命周期。

## 如何使用函数式组件+Hook

### useState

- seState最好写到函数的起始位置，便于阅读，且严禁出现在判断、循环中

- hook内部使用Object.is来比较新/旧state是否相等

- useState 唯一的参数就是初始 state

- useState 会返回一个数组：一个 state，一个更新 state 的函数
  - 在初始化渲染期间，返回的状态 (state) 与传入的第一个参数 (initialState) 值相同
  - 可以在事件处理函数中或其他一些地方调用这个函数。它类似 class 组件的 this.setState，但是它不会把新的 state 和旧的 state 进行合并，而是直接替换

```javascript
// 这里可以任意命名，因为返回的是数组，数组解构
const [state, setState] = useState(initialState);
```

### useReducer

- useReducer 和 redux 中 reducer 很像
- useState 内部就是靠 useReducer 来实现的
- useState 的替代方案，它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法
- 在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等

```javascript
const initialState = 0;
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {number: state.number + 1};
    case 'decrement':
      return {number: state.number - 1};
    default:
      throw new Error();
  }
}
function init(initialState){
    return {number:initialState};
}
function Counter(){
    const [state, dispatch] = useReducer(reducer, initialState,init);
    return (
        <>
          Count: {state.number}
          <button onClick={() => dispatch({type: 'increment'})}>+</button>
          <button onClick={() => dispatch({type: 'decrement'})}>-</button>
        </>
    )
}
```

### useEffect

- effect（副作用）：指那些没有发生在数据向视图转换过程中的逻辑，如 ajax 请求、访问原生dom 元素、本地持久化缓存、绑定/解绑事件、添加订阅、设置定时器、记录日志等。

- useEffect 接收一个函数，该函数会在组件渲染到屏幕之后才执行，该函数有要求：要么返回一个能清除副作用的函数，要么就不返回任何内容

- useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API

```javascript

function Counter(){
    let [number,setNumber] = useState(0);
    let [text,setText] = useState('');
    // 相当于componentDidMount 和 componentDidUpdate
    useEffect(()=>{
        console.log('开启一个新的定时器')
        let $timer = setInterval(()=>{
            setNumber(number=>number+1);
        },1000);
        // useEffect 如果返回一个函数的话，该函数会在组件卸载和更新时调用
        // useEffect 在执行副作用函数之前，会先调用上一次返回的函数
        // 如果要清除副作用，要么返回一个清除副作用的函数
       /*  return ()=>{
            console.log('destroy effect');
            clearInterval($timer);
        } */
    });
    // },[]);//要么在这里传入一个空的依赖项数组，这样就不会去重复执行
    return (
        <>
          <input value={text} onChange={(event)=>setText(event.target.value)}/>
          <p>{number}</p>
          <button>+</button>
        </>
    )
}
```

### 自定义Hook

- 自定义 Hook 更像是一种约定，如果函数的名字以 use 开头，并且`调用了其他的 Hook`，则就称其为一个自定义 Hook
- 有时候我们会想要在组件之间重用一些状态逻辑，之前要么用 render props ，要么用高阶组件，要么使用 redux，自定义 Hook 可以让你在不增加组件的情况下达到同样的目的
- Hook 是一种复用状态逻辑的方式，它不复用 state 本身，事实上 Hook 的每次调用都有一个完全独立的 state

```javascript
import React, { useLayoutEffect, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function useNumber(){
  let [number,setNumber] = useState(0);
  useEffect(()=>{
    setInterval(()=>{
        setNumber(number=>number+1);
    },1000);
  },[]);
  return [number,setNumber];
}

// 每个组件调用同一个 hook，只是复用 hook 的状态逻辑，并不会共用一个状态
function Counter1(){
    let [number,setNumber] = useNumber();
    return (
        <div>
          <button
          onClick={()=>{setNumber(number+1)}}
          >
            {number}
          </button>
        </div>
    )
}

function Counter2(){
    let [number,setNumber] = useNumber();
    return (
        <div>
          <button
          onClick={()=>{setNumber(number+1)}}
          >
            {number}
          </button>
        </div>
    )
}
ReactDOM.render(<><Counter1 /><Counter2 /></>, document.getElementById('root'));
```
