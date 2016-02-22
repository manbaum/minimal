
"use strict"

var _async = require("./async");
var convert_f2c = _async.convert_f2c;
var convert_p2c = _async.convert_p2c;
var convert_f2p = _async.convert_f2p;
var convert_c2p = _async.convert_c2p;
var callcc_c = _async.callcc_c;
var callcc_p = _async.callcc_p;
var task = _async.task;
var async = _async.async;

var print = function() {
	[...arguments].forEach(function(v) {
		if (v && v.stack) {
			console.log(v.stack);
			while (v.cause && v.cause.stack) {
				v = v.cause;
				console.log(`caused by: ${v.stack}`);
			}
		} else {
			console.log(v);
		}
	});
};

var immediate_value = function(value) {
	return value;
};
var immediate_error = function(message) {
	throw new Error(message);
};
var promised_value = function(value) {
	return Promise.resolve(value);
};
var promised_error = function(message) {
	return Promise.reject(new Error(message));
};

var test = function*(a, b, c, d) {
	print(`--- test begin ---`);

	let va = yield immediate_value(a);
	print(`va is ${va}`);

	try {
		let vb = yield immediate_error(b);
	} catch (e) {
		if (e.message == "good") {
			return `${e.message} and bye!!`;
		} else if (e.message == "bad") {
			let ne = new Error(`${e.message} and bye!!`);
			ne.cause = e;
			throw ne;
		} else {
			print(`vb's error is ${e.message}`);
		}
	}

	let vc = yield promised_value(c);
	print(`vc is ${vc}`);

	try {
		let vd = yield promised_error(d);
	} catch (e) {
		print(`vd's error is ${e.message}`);
	}

	print(`--- test end ---`);

	return "bye!!";
};

// async(test)("ok 1", "error 2", "ok 3", "error 4")
// .then(print, print)
// .then(() => task(test)("ok 1", "good").run().promise())
// .then(print, print)
// .then(() => task(test)("ok 1", "bad").run().promise())
// .then(print, print);

var _test2 = function() {
	let a = callcc(function(cc) {
		return 5;
	});
	print(`a = ${a}`);
	let b = callcc(function(cc) {
		cc(6);
	});
	print(`b = ${b}`);
	let k = null;
	let x = callcc(function(cc) {
		k = cc;
		return 0;
	});
	print(`x = ${x}`);
	if (x < 5) k(x + 1);
};

var test2c = function() {
	let a = null;
	let b = null;
	let k = null;
	let x = null;
	callcc_c(function(cc) {
		return 5;
	}, null, function(error, value) {
		a = value;
		print(`a = ${a}`);
		callcc_c(function(cc) {
			cc(null, 6);
		}, null, function(error, value) {
			b = value;
			print(`b = ${b}`);
			callcc_c(function(cc) {
				k = cc;
				return 0;
			}, null, function(error, value) {
				x = value;
				print(`x = ${x}`);
				if (x < 5) k(null, x + 1);
			});
		});
	});
};

var test2p = function() {
	let a = null;
	let b = null;
	let k = null;
	let x = null;
	callcc_c(function(cc) {
		return 5;
	}, null, function(error, value) {
		a = value;
		print(`a = ${a}`);
		callcc_c(function(cc) {
			cc(null, 6);
		}, null, function(error, value) {
			b = value;
			print(`b = ${b}`);
			callcc_c(function(cc) {
				k = cc;
				return 0;
			}, null, function(error, value) {
				x = value;
				print(`x = ${x}`);
				if (x < 5) k(null, x + 1);
			});
		});
	});
};


test2p();
