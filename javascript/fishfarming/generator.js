"use strict"

const util = require("util"),
	D = require("./property"),
	M = require("./memoize");

const toInteger = value => {
	let number = Number(value);
	if (isNaN(number)) {
		return 0;
	} else if (number === 0 || !isFinite(number)) {
		return number;
	} else {
		return (number > 0 ? 1 : -1) * Math.trunc(Math.abs(number));
	}
};
const toLength = value => {
	let len = toInteger(value);
	return Math.min(Math.max(len, 0), Number.MAX_SAFE_INTEGER);
};
const isRegExp = x => x && x.constructor === RegExp;

const G = (function*() {})().constructor;

D(G)
	.method({
		isGenerator(gen) {
			return gen && gen.constructor === G;
		},
		isIterable(it) {
			return it && util.isFunction(it[Symbol.iterator]);
		},
		isArrayLike(it) {
			return it && ("length" in Object(it));
		},
		create: function*(it) {
			if (!it) return;

			if (G.isIterable(it)) {
				yield* it;
			} else if (G.isArrayLike(it)) {
				let items = Object(it),
					n = toLength(items.length);
				for (let i = 0; i < n; i++) {
					yield items[i];
				}
			}
		},
		of: function*(...elements) {
			yield* elements;
		},
		from(it, cb, thisArg) {
			let gen;
			if (G.isGenerator(it)) {
				gen = it;
			} else if (Array.isArray(it)) {
				gen = it.toGenerator();
			} else {
				gen = G.create(it);
			}
			return cb ? G.map(cb, thisArg)(gen) : gen;
		},
		nil: function*() {},
		xnat: (s = 0) => function*(n) {
			const ns = toLength(s),
				nn = toLength(n);
			for (let i = 0; i < nn; i++) {
				yield ns + i;
			}
		},
		nat: n => G.xnat(0)(n),
		xnatrev: (s = 0) => function*(n) {
			const ns = toLength(s),
				nn = toLength(n);
			for (let i = 0; i < nn; i++) {
				yield ns + (nn - 1) - i;
			}
		},
		natrev: n => G.xnat(0)(n),
		xneg: (s = -1) => function*(n) {
			const ns = toLength(s),
				nn = toLength(n);
			for (let i = 0; i < nn; i++) {
				yield ns - i;
			}
		},
		neg: n => G.xnat(-1)(n),
		xnegrev: (s = -1) => function*(n) {
			const ns = toLength(s),
				nn = toLength(n);
			for (let i = 0; i < nn; i++) {
				yield ns - (nn - 1) + i;
			}
		},
		negrev: n => G.xnat(-1)(n),
		regexec: (re, cb, thisArg) => function*(string) {
			if (isRegExp(re)) {
				const n = string.length;
				let i = 0;
				re.lastIndex = 0;
				while (re.lastIndex < n) {
					const array = re.exec(string);
					if (array) yield cb ? cb.call(thisArg, array, i++, re) : array[0];
					else break;
				}
			}
		},
		split: (sp, cb, thisArg) => function*(string) {
			const re = isRegExp(sp) ? sp : new RegExp(sp, "g");
			let saveIndex = 0,
				i = 0;
			yield* G.regexec(re,
				array => {
					const s = string.substring(saveIndex, array.index);
					saveIndex = array.index + array[0].length;
					return cb ? cb.call(thisArg, s, i++, sp, string) : s;
				})(string);
			if (saveIndex < string.length) {
				const s = string.substring(saveIndex);
				yield cb ? cb.call(thisArg, s, i, sp, string) : s;
			}
		},
		iterate: (cb, thisArg) => function*(x) {
			let m = x,
				i = 0;
			yield m;
			while (true) {
				m = cb.call(thisArg, m, i++);
				yield m;
			}
		},
		repeat: function*(x) {
			while (true) {
				yield x;
			}
		},
		replicate: n => function*(x) {
			const nn = toLength(n);
			for (let i = 0; i < nn; i++) {
				yield x;
			}
		},
		cycle: (gen, thisArg) => function*() {
			while (true) {
				yield* gen.apply(thisArg, arguments);
			}
		},
		fork: (gen, thisArg) => (n = 2) => {
			return G.nat(n).map(i => gen.call(thisArg, i));
		},
		forEach: (cb, thisArg) => function*(xgen) {
			let i = 0;
			for (let x of xgen) {
				cb.call(thisArg, x, i++, xgen);
			}
		},
		map: (cb, thisArg) => function*(xgen) {
			let i = 0;
			for (let x of xgen) {
				yield cb.call(thisArg, x, i++, xgen);
			}
		},
		flatMap: xgen => function*(cb, thisArg) {
			let i = 0;
			for (let x of xgen) {
				yield* cb.call(thisArg, x, i++, xgen);
			}
		},
		select: (...keys) => function*(xgen) {
			for (let x of xgen) {
				yield keys.map(key => x[key]);
			}
		},
		find: (cb, thisArg) => xgen => {
			let i = 0;
			for (let x of xgen) {
				if (cb.call(thisArg, x, i++, xgen)) {
					return x;
				}
			}
		},
		findIndex: (cb, thisArg) => xgen => {
			let i = 0;
			for (let x of xgen) {
				if (cb.call(thisArg, x, i, xgen)) {
					return i;
				}
				++i;
			}
			return -1;
		},
		filter: (cb, thisArg) => function*(xgen) {
			let i = 0;
			for (let x of xgen) {
				if (cb.call(thisArg, x, i++, xgen)) {
					yield x;
				}
			}
		},
		and: xgen => {
			let x = true;
			for (x of xgen) {
				if (!x) break;
			}
			return x;
		},
		or: xgen => {
			let x = false;
			for (x of xgen) {
				if (x) break;
			}
			return x;
		},
		every: (cb, thisArg) => xgen => {
			let y = true,
				i = 0;
			for (let x of xgen) {
				y = cb.call(thisArg, x, i++, xgen);
				if (!y) break;
			}
			return y;
		},
		some: (cb, thisArg) => xgen => {
			let y = false,
				i = 0;
			for (let x of xgen) {
				y = cb.call(thisArg, x, i++, xgen);
				if (y) break;
			}
			return y;
		},
		concat: function*(...genArray) {
			for (let gen of genArray) {
				yield* gen;
			}
		},
		concatMap: (cb, thisArg) => function*(xgen) {
			let i = 0;
			for (let x of xgen) {
				yield* cb.call(thisArg, x, i++, xgen);
			}
		},
		fold: (cb, thisArg) => initVal => xgen => {
			let y = initValue,
				i = 0;
			for (let x of xgen) {
				y = cb.call(thisArg, y, x, i++, xgen);
			}
			return y;
		},
		fold1: (cb, thisArg) => xgen => {
			let y, i = 0;
			for (let x of xgen) {
				y = i == 0 ? x : cb.call(thisArg, y, x, i, xgen);
				++i;
			}
			return y;
		},
		reduce(cb, initVal) {
			return arguments.length < 2 ? G.fold1(cb) : G.fold(cb)(initVal);
		},
		scan: (cb, thisArg) => (initVal, yieldInitVal = true) => function*(xgen) {
			let y = initVal,
				i = 0;
			if (yieldInitVal) yield y;
			for (let x of xgen) {
				y = cb.call(thisArg, y, x, i++, xgen);
				yield y;
			}
		},
		scan1: (cb, thisArg) => function*(xgen) {
			let y, i = 0;
			for (let x of xgen) {
				y = i == 0 ? x : cb.call(thisArg, y, x, i, xgen);
				++i;
				yield y;
			}
		},
		take: n => function*(xgen) {
			const nn = toLength(n);
			let i = 0;
			for (let x of xgen) {
				if (i++ < nn) yield x;
				else break;
			}
		},
		drop: n => function*(xgen) {
			const nn = toLength(n);
			let i = 0;
			for (let x of xgen) {
				if (i < nn) {
					++i;
					continue;
				} else {
					yield x;
				}
			}
		},
		takeWhile: (cb, thisArg) => function*(xgen) {
			let i = 0;
			for (let x of xgen) {
				if (cb.call(thisArg, x, i++, xgen)) {
					yield x;
				} else {
					break;
				}
			}
		},
		dropWhile: (cb, thisArg) => function*(xgen) {
			let i = 0;
			for (let x of xgen) {
				if (cb.call(thisArg, x, i, xgen)) {
					++i;
					continue;
				} else {
					yield x;
				}
			}
		},
		zip: function*(...genArray) {
			const n = genArray.length;
			if (n > 0) {
				while (true) {
					const xs = Array(n);
					for (let i = 0; i < n; i++) {
						const x = genArray[i].next();
						if (x.done) return;
						else xs[i] = x.value;
					}
					yield xs;
				}
			}
		},
		zipWith: (cb, thisArg) => function*(...genArray) {
			const n = genArray.length;
			if (n > 0) {
				let j = 0;
				while (true) {
					const xs = Array(n);
					for (let i = 0; i < n; i++) {
						const x = genArray[i].next();
						if (x.done) return;
						else xs[i] = x.value;
					}
					yield cb.call(thisArg, ...xs, j++, ...genArray);
				}
			}
		},
		group: (cb, thisArg) => xgen => {
			return G.group2([])(cb, thisArg)(xgen);
		},
		group2: (container = []) => (cb, thisArg) => xgen => {
			const get = M.forceArrayGet(container, _ => []);
			let i = 0;
			for (let x of xgen) {
				const groupKey = cb.call(thisArg, x, i++, xgen);
				get(groupKey).push(x);
			}
			return container;
		},
		collapse: function*(xgen) {
			for (let x of xgen) {
				yield* x;
			}
		},
		toArray(xgen) {
			return xgen._array_ || Array.from(xgen);
		},
		toArray2(xgen, cb, thisArg) {
			const array = xgen._array_ || Array.from(xgen);
			return cb ? array.map(cb, thisArg) : array;
		},
		toArrayRecursive(xgen) {
			const convert = x => {
				if (G.isGenerator(x)) {
					return G.toArray(x, convert);
				} else if (G.isIterable(x) || G.isArrayLike(x)) {
					return G.toArray(G.create(x), convert);
				} else {
					return x;
				}
			};
			return G.toArray(xgen, convert);
		},
		join: (sp, cb, thisArg) => xgen => {
			let string = "",
				i = 0,
				first = true;
			for (let x of xgen) {
				if (first) first = false;
				else string += sp;
				string += cb ? cb.call(thisArg, x, i++, xgen) : x;
			}
			return string;
		}
	});

D(Array.prototype)
	.method({
		toGenerator() {
			return D(G.create(this))
				.freeze({
					_array_: this
				})
				.target;
		}
	});

D(G.prototype)
	.method({
		forEach(cb, thisArg) {
			return G.forEach(cb, thisArg)(this);
		},
		map(cb, thisArg) {
			return G.map(cb, thisArg)(this);
		},
		flatMap(cb, thisArg) {
			return G.flagMap(this)(cb, thisArg);
		},
		select(...keys) {
			return G.select(...keys)(this);
		},
		find(cb, thisArg) {
			return G.find(cb, thisArg)(this);
		},
		findIndex(cb, thisArg) {
			return G.findIndex(cb, thisArg)(this);
		},
		filter(cb, thisArg) {
			return G.filter(cb, thisArg)(this);
		},
		and() {
			return G.and(this);
		},
		or() {
			return G.or(this);
		},
		every(cb, thisArg) {
			return G.every(cb, thisArg)(this);
		},
		some(cb, thisArg) {
			return G.some(cb, thisArg)(this);
		},
		concat(...genArray) {
			return G.concat(this, ...genArray);
		},
		concatMap(cb, thisArg) {
			return G.concatMap(cb, thisArg)(this);
		},
		fold(cb, thisArg) {
			return initVal => G.fold(cb, thisArg)(initVal)(this);
		},
		fold1(cb, thisArg) {
			return G.fold1(cb, thisArg)(this);
		},
		reduce(cb, initVal) {
			return arguments.length < 2 ? G.fold1(cb)(this) : G.fold(cb)(initVal)(this);
		},
		scan(cb, thisArg) {
			return (initVal, yieldInitVal = true) => G.scan(cb, thisArg)(initVal, yieldInitValue)(this);
		},
		scan1(cb, thisArg) {
			return G.scan1(cb, thisArg)(this);
		},
		take(n) {
			return G.take(n)(this);
		},
		drop(n) {
			return G.drop(n)(this);
		},
		takeWhile(cb, thisArg) {
			return G.takeWhile(cb, thisArg)(this);
		},
		dropWhile(cb, thisArg) {
			return G.dropWhile(cb, thisArg)(this);
		},
		zip(...genArray) {
			return G.zip(this, ...genArray);
		},
		zipWith(cb, thisArg) {
			return (...genArray) => G.zipWith(cb, thisArg)(this, ...genArray);
		},
		group(cb, thisArg) {
			return G.group(cb, thisArg)(this);
		},
		group2(container = []) {
			return (cb, thisArg) => G.group2(container)(cb, thisArg)(this);
		},
		collapse() {
			return G.collapse(this);
		},
		toArray(cb, thisArg) {
			return G.toArray2(this, cb, thisArg);
		},
		toArrayRecursive() {
			return G.toArrayRecursive(this);
		},
		join(sp, cb, thisArg) {
			return G.join(sp, cb, thisArg)(this);
		}
	});

module.exports = G;