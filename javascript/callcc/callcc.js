
"use strict"

const defer = exports.defer = function(f, context, time_delay) {
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

const convert = exports.convert = {};

const f2c = convert.f2c = function(funF, context) {
	return function() {
		let args = [...arguments];
		let last = args.splice[args.length - 1, 1];
		let cps = isFunction(last[0]) ? defer(last[0]) : null;
		try {
			let value = funF.apply(context, args);
			if (cps) cps(null, value);
		} catch (error) {
			if (cps) cps(error);
		}
	};
};
const p2c = convert.p2c = function(funP, context, scatterArray) {
	return function() {
		let args = [...arguments];
		let last = args.splice[args.length - 1, 1];
		let cps = isFunction(last[0]) ? last[0] : null;
		try {
			funP.apply(context, args).then(function(value) {
				if (cps) {
					if (scatterArray && Array.isArray(value)) {
						value.unshift(null);
						cps.apply(null, value);
					} else {
						cps(null, value);
					}
				}
			}, function(error) {
				if (cps) cps(error);
			});
		} catch (error) {
			if (cps) cps(error);
		}
	};
};
const f2p = convert.f2p = function(funF, context) {
	return function() {
		let args = [...arguments];
		return new Promise(function(resolve, reject) {
			resolve(funF.apply(context, args));
		});		
	};
};
const c2p = convert.c2p = function(funC, context, gatherArray) {
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

const callcc_c4f = exports.callcc = function(lambdaF, context, cps) {
	let called = false;
	let cc = function() {
		called = true;
		defer(cps).apply(null, arguments);
	};
	try {
		let value = lambdaF.call(context, cc);
		if (!called) cps(null, value);
	} catch (error) {
		if (!called) cps(error);
	}
};
const callcc_c4c = exports.callcc4c = function(lambdaC, context, cps) {
	lambdaC.call(context, defer(cps), cps);
};
