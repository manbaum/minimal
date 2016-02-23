
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

const create = function(genF, context, args, h) {
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

		let g = genF.apply(context, args);
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
		throw new TypeError("genF should be a GeneratorFunction");
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
