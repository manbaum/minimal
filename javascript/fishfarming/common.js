"use strict"

const D = require("./property");

const println = s => console.log(s);
const xprintln = (...ss) => console.log(ss.join(""));
const debug = (...xs) => (xs.forEach(println), xs[xs.length - 1]);
const debug2 = (r, ...xs) => (xs.forEach(println), r);
const fix = (n, padding = "0") => {
	const pad = padding.repeat(n),
		trunc = s => s.substring(s.length - n);
	return x => {
		const s = String(x);
		return s.length >= n ? s : trunc(pad + s);
	};
};

const removeModule = s => {
	const moduleId = require.resolve(s);
	const i = module.children.findIndex(m => m.id == moduleId);
	if (i >= 0) {
		module.children.splice(i, 1);
		console.log(`* Ok, module "${s}" has been removed from module.children.`);
	} else {
		console.log(`* OMG, Why module "${s}" does not exist in module.children?`);
	}
	if (require.cache[moduleId]) {
		delete require.cache[moduleId];
		console.log(`* Ok, module "${s}" has been removed from require.cache.`);
	} else {
		console.log(`* WTF! Are you sure that module "${s}" has been loaded, ever?`);
	}
};

D(Function.prototype)
	.method({
		thenCall(f) {
			const self = this;
			return function() {
				return f.call(null, self.apply(null, arguments));
			};
		},
		thenApply(f) {
			const self = this;
			return function() {
				return f.apply(null, self.apply(null, arguments));
			};
		}
	});

module.exports = {
	println,
	xprintln,
	debug,
	debug2,
	fix,
	D
};