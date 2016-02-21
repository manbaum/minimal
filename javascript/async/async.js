
"use strict"

module.exports = function(genF, context) {
	return function() {
		return new Promise(function(resolve, reject) {			
			let toolbox = { return: resolve, throw: reject };
			let args = [toolbox, ...arguments];
			let g = genF.apply(context, args);
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
					status = g.throw(value);
					process.nextTick(run);
				} catch (error) {
					reject(error);
				}
			};
			let run = function() {
				var apply = status.done ? resolve : next;
				if (status.value && status.value.constructor === Promise) {
					status.value.then(apply, status.done ? reject : recover);
				} else {
					apply(status.value);
				}
			};
			process.nextTick(run);
		});
	};
};
