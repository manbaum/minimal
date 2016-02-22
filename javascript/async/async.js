
"use strict"

var GeneratorFunction = (function*(){}).constructor;

var create = function(genF, context, args, r) {
	return function(resolve, reject) {
		let done = false;
		let running = false;
		r.is_done = function() {
			return done;
		};
		r.is_running = function() {
			return running;
		};
		r.return = function(value) {
			if (!done) {
				done = true;
				running = false;
				resolve(value);
			}
			return r;
		};
		r.throw = function(error) {
			if (!done) {
				done = true;
				running = false;
				reject(error);
			}
			return r;
		};

		let g = genF.apply(context, args);
		let status = {};
		let next = function(value) {
			try {
				status = g.next(value);
				process.nextTick(r.run);
			} catch (error) {
				recover(error);
			}
		};
		let recover = function(error) {
			try {
				status = g.throw(error);
				process.nextTick(r.run);
			} catch (error) {
				r.throw(error);
			}
		};
		r.run = function() {
			if (!done) {
				if (!running) running = true;
				let apply = status.done ? r.return : next;
				if (status.value && status.value.constructor === Promise) {
					status.value.then(apply, status.done ? r.throw : recover);
				} else {
					apply(status.value);
				}
			}
			return r;
		};
	};
};

var make_task = function(genF, context) {
	if (!genF || genF.constructor !== GeneratorFunction) {
		throw new TypeError("genF should be GeneratorFunction");
	}
	return function() {
		let args = [...arguments];
		let r = {};
		let promise = new Promise(create(genF, context, args, r));
		r.promise = function() {
			return promise;
		};
		return r;
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
