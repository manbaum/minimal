
"use strict"

var async = require("./async");

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

var test = async(function*(toolbox, a, b, c, d) {
	print(`--- test begin ---`);

	let va = yield immediate_value(a);
	print(`va is ${va}`);

	try {
		let vb = yield immediate_error(b);
	} catch (e) {
		if (e.message == "good") {
			toolbox.return(`${e.message} and bye!!`);
		} else if (e.message == "bad") {
			let ne = new Error(`${e.message} and bye!!`);
			ne.cause = e;
			toolbox.throw(ne);
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
});

test("ok 1", "error 2", "ok 3", "error 4")
.then(print, print)
.then(() => test("ok 1", "good"))
.then(print, print)
.then(() => test("ok 1", "bad"))
.then(print, print);
