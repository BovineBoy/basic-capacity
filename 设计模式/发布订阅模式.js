/**
 * 发布订阅模式：又称为观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖它的对象都将得到通知。
 * 思路：
 * 1. 创建一个对象(缓存列表)
 * 2. on方法把回调函数fn都添加到缓存列表中
 * 3. emit方法取到arguments里第一个参数当做key，根据key值执行对应缓存列表中的函数
 * 4. remove方法可以根据key值取消订阅
 */

//简单实现
// const crop = {}; //自定义一个公司对象
// crop.list = []; //列表用于缓存回调函数
// //订阅事件
// crop.on = function(fn) {
// 	// 将回调fn缓存到list列表
// 	this.list.push(fn);
// };
// // 发布事件
// crop.emit = function() {
// 	// 发布的时候把列表里的函数依次执行
// 	this.list.forEach(cb => {
// 		cb.apply(this, arguments);
// 	});
// };
// // 测试用例
// crop.on(function(job, salary) {
// 	console.log(job, salary);
// });
// crop.on(function(skill, hobby) {
// 	console.log(skill, hobby);
// });
// crop.emit('前端', 10000);
// crop.emit('端茶倒水', '足球');
/**
 * 前端 10000
 * 前端 10000
 * 端茶倒水 足球
 * 端茶倒水 足球
 */

//改良版

//自定义一个公司对象
// const crop = {
// 	//列表用于缓存回调函数
// 	list: {},
// 	/**
// 	 * 订阅事件
// 	 * @param {string} key 键值
// 	 * @param {function} fn 回调函数
// 	 */
// 	on: function(key, fn) {
// 		// 如果对象中没有对应的key值就证明没有订阅过，那就给key创建一个对应的缓存列表
// 		if (!this.list[key]) this.list[key] = [];
// 		// 把回调函数添加到对应的key值缓存列表中
// 		this.list[key].push(fn);
// 	},
// 	/**
// 	 * 发布事件
// 	 */
// 	emit: function() {
// 		// 第一个参数是对应的key值，直接用数组的shift方法取出
// 		const key = [].shift.call(arguments),
// 			fns = this.list[key];
// 		// 如果缓存列表里没有函数就返回false
// 		if (!fns || fns.length === 0) return false;
// 		// 遍历key值对应的缓存列表，依次执行函数的方法
// 		Array.from(fns) &&
// 			Array.isArray(fns) &&
// 			fns.forEach(fn => {
// 				fn.apply(this, arguments);
// 			});
// 	}
// };

// // 测试用例
// crop.on('one', function(job, sex) {
// 	console.log(`工作是${job}，性别是${sex}`);
// });
// crop.on('two', function(skill, hobby) {
// 	console.log(`技能是${skill}，爱好是${hobby}`);
// });
// crop.emit('one', '前端', '男');
// crop.emit('one', '后端', '男');
// crop.emit('two', '端茶倒水', '足球');

// 改良版
const event = {
	list: {},
	/**
	 * 订阅事件
	 * @param {string} key 键值
	 * @param {function} fn 回调函数
	 */
	on(key, fn) {
		if (!this.list[key]) this.list[key] = [];
		this.list[key].push(fn);
	},
	/**
	 * 发布事件
	 */
	emit() {
		const key = [].shift.call(arguments),
			fns = this.list[key];
		if (!fns || fns.length === 0) return false;
		Array.from(fns) &&
			Array.isArray(fns) &&
			fns.forEach(fn => {
				fn.apply(this, arguments);
			});
	},
	/**
	 * 取消订阅
	 * @param {string} key 键值
	 * @param {function} fn	回调函数
	 */
	remove(key, fn) {
		const fns = this.list[key];
		// 如果缓存列表中没有函数直接返回
		if (!fns) return false;
		// 如果没有传入对应函数，会将key值对应缓存列表中的函数都清空掉
		if (!fn) {
			fns && (fns.length = 0);
		} else {
			// 如果存在fn就删除对应fn
			fns.forEach((cb, i) => {
				if (cb === fn) {
					fns.splice(i, 1);
				}
			});
		}
	}
};
