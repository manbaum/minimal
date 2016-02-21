
"use strict"

var GeneratorFunction = (function*(){}).constructor;

module.exports = function(genF, context) {
	if (!genF || genF.constructor !== GeneratorFunction) {
		throw new TypeError("genF should be GeneratorFunction");
	}
	return function() {
		let args = [...arguments];
		return new Promise(function(resolve, reject) {
			let done = false;
			let toolbox = {
				return: function(value) {
					if (!done) {
						done = true;
						resolve(value);
					}
				},
				throw: function(error) {
					if (!done) {
						done = true;
						reject(error);
					}
				}
			};
			let g = genF.apply(context, [toolbox, ...args]);
			let status = {};
			let next = function(value) {
				try {
					status = g.next(value);
					process.nextTick(run);
				} catch (error) {
					recover(error);
				}
			};
			let recover = function(error) {
				try {
					status = g.throw(error);
					process.nextTick(run);
				} catch (error) {
					toolbox.throw(error);
				}
			};
			let run = function() {
				if (!done) {
					let apply = status.done ? toolbox.return : next;
					if (status.value && status.value.constructor === Promise) {
						status.value.then(apply, status.done ? toolbox.throw : recover);
					} else {
						apply(status.value);
					}
				}
			};
			next();
		});
	};
};
