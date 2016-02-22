
"use strict"

const isFunction = function(f) {
	return f != null && f.constructor === Function;
};
const GeneratorFunction = (function*(){}).constructor;
const isGeneratorFunction = function(f) {
	return f != null && f.constructor === GeneratorFunction;
};
const defer = function(f, context, time_delay) {
	time_delay = Number(time_delay);
	return function() {
		let args = [...arguments];
		let work = function() {
			f.apply(context, args);
		};
		if (time_delay > 0) {
			setTimeout(work, time_delay);
		} else {
			process.nextTick(work);
		}
	};
};

const convert_f2c = exports.convert_f2c = function(funF, context) {
	return function() {
		let args = [...arguments];
		let last = args.splice[args.length - 1, 1];
		let callback = isFunction(last[0]) ? defer(last[0]) : null;
		try {
			let value = funF.apply(context, args);
			if (callback) callback(null, value);
		} catch (error) {
			if (callback) callback(error);
		}
	};
};
const convert_p2c = exports.convert_p2c = function(funP, context, scatterArray) {
	return function() {
		let args = [...arguments];
		let last = args.splice[args.length - 1, 1];
		let callback = isFunction(last[0]) ? defer(last[0]) : null;
		try {
			funP.apply(context, args).then(function(value) {
				if (callback) {
					if (scatterArray && Array.isArray(value)) {
						value.unshift(null);
						callback.apply(null, value);
					} else {
						callback(null, value);
					}
				}
			}, function(error) {
				if (callback) callback(error);
			});
		} catch (error) {
			if (callback) callback(error);
		}
	};
};
const convert_f2p = exports.convert_f2p = function(funF, context) {
	return function() {
		let args = [...arguments];
		return new Promise(function(resolve, reject) {
			resolve(funF.apply(context, args));
		});		
	};
};
const convert_c2p = exports.convert_c2p = function(funC, context, gatherArray) {
	return function() {
		let args = [...arguments];
		return new Promise(function(resolve, reject) {
			funC.apply(context, [...args, function(error, value) {
				if (error) {
					reject(error);
				} else if (gatherArray) {
					let array = [...arguments];
					array.shift();
					resolve(array);
				} else {
					resolve(value);
				}
			}]);
		});
	};
};

const callcc = exports.callcc = function(lambdaF, context, callback) {
	let called = false;
	let cc = function() {
		called = true;
		defer(callback).apply(null, arguments);
	};
	try {
		let value = lambdaF.call(context, cc);
		if (!called) defer(callback)(null, value);
	} catch (error) {
		if (!called) defer(callback)(error);
	}
};

const create = function(funG, context, args, h) {
	return function(resolve, reject) {
		let done = false;
		let running = false;
		h.is_done = function() {
			return done;
		};
		h.is_running = function() {
			return running;
		};
		h.return = function(value) {
			if (!done) {
				done = true;
				running = false;
				resolve(value);
			}
			return h;
		};
		h.throw = function(error) {
			if (!done) {
				done = true;
				running = false;
				reject(error);
			}
			return h;
		};

		let g = funG.apply(context, args);
		let status = {};
		let next = function(value) {
			try {
				status = g.next(value);
				process.nextTick(h.run);
			} catch (error) {
				recover(error);
			}
		};
		let recover = function(error) {
			try {
				status = g.throw(error);
				process.nextTick(h.run);
			} catch (error) {
				h.throw(error);
			}
		};
		h.run = function() {
			if (!done) {
				if (!running) running = true;
				let apply = status.done ? h.return : next;
				if (status.value && status.value.constructor === Promise) {
					status.value.then(apply, status.done ? h.throw : recover);
				} else {
					apply(status.value);
				}
			}
			return h;
		};
	};
};
const make_task = exports.task = function(genF, context) {
	if (!isGeneratorFunction(genF)) {
		throw new TypeError("genF should be GeneratorFunction");
	}
	return function() {
		let handle = {};
		let promise = new Promise(create(genF, context, arguments, handle));
		handle.promise = function() {
			return promise;
		};
		return handle;
	};
};
const make_async = exports.async = function(genF, context) {
	let task = make_task(genF, context);
	return function() {
		return task.apply(null, arguments).run().promise();
	};
};
