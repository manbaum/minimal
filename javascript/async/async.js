
"use strict"

var GeneratorFunction = (function*(){}).constructor;

var create = function(genF, context, args, h) {
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

var make_task = function(genF, context) {
	if (!genF || genF.constructor !== GeneratorFunction) {
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

var make_async = function(genF, context) {
	let task = make_task(genF, context);
	return function() {
		return task.apply(null, arguments).run().promise();
	};
};

exports.task = make_task;
exports.async = make_async;
