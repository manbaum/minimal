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

const nil = function*() {};
const GeneratorFunction = nil.constructor;
const G = nil().constructor;

const toArrayRecursive = x => {
	if (x != null && typeof x.valueOf() == "object" &&
		(G.isGenerator(x) || G.isIterable(x) || G.isArrayLike(x))) {
		return Array.from(x, toArrayRecursive);
	} else {
		return x;
	}
};

D(G)
	.method({
		isGenerator(gen) {
			return gen && gen.constructor === G;
		},
		isIterable(it) {
			return it && util.isFunction(it[Symbol.iterator]);
		},
		isArrayLike(it) {
			return it && "length" in Object(it);
		},
		isGeneratorFunction(genF) {
			return genF && genF.constructor === GeneratorFunction;
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
		of: function*() {
			yield* arguments;
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
		from1(it) {
			return G.from(it);
		},
		nil,
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
		natrev: n => G.xnatrev(0)(n),
		xneg: (s = -1) => function*(n) {
			const ns = toLength(s),
				nn = toLength(n);
			for (let i = 0; i < nn; i++) {
				yield ns - i;
			}
		},
		neg: n => G.xneg(-1)(n),
		xnegrev: (s = -1) => function*(n) {
			const ns = toLength(s),
				nn = toLength(n);
			for (let i = 0; i < nn; i++) {
				yield ns - (nn - 1) + i;
			}
		},
		negrev: n => G.xnegrev(-1)(n),
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
		splitLine(lineSP = /\r\n|\n|\r/g, cb, thisArg) {
			return G.split(lineSP, cb, thisArg);
		},
		wrapLine: (lineWidth = 40, indentWidth = 0, indentChar = " ") => function*(string) {
			const nLineWidth = toLength(lineWidth);
			if (nLineWidth < 1) {
				yield string;
			} else {
				const nIndentWidth = toLength(Math.abs(indentWidth)),
					indentString = indentChar.repeat(nIndentWidth),
					isHangingIndent = indentWidth >= 0;
				let toWrap = string,
					width = isHangingIndent ? nLineWidth : nLineWidth - nIndentWidth,
					isFirstLine = true;
				const update = (wrapped, rest) => {
					toWrap = rest;
					if (isFirstLine) {
						isFirstLine = false;
						width = isHangingIndent ? nLineWidth - nIndentWidth : nLineWidth;
						return isHangingIndent ? wrapped : indentString + wrapped;
					} else {
						return isHangingIndent ? indentString + wrapped : wrapped;
					}
				};
				while (true) {
					const n = toWrap.length;
					if (n == 0) {
						break;
					} else if (n < width) {
						yield update(toWrap);
						break;
					} else {
						let lastSP = n;
						while (lastSP > width) {
							lastSP = toWrap.lastIndexOf(" ", lastSP - 1);
						}
						if (lastSP < 0) {
							yield update(
								toWrap.substring(0, width),
								toWrap.substring(width));
						} else {
							yield update(
								toWrap.substring(0, lastSP),
								toWrap.substring(lastSP + 1));
						}
					}
				}
			}
		},
		iterate: (cb, thisArg) => function*(x) {
			let y = x,
				i = 0;
			yield y;
			while (true) {
				y = cb.call(thisArg, y, i++);
				yield y;
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
		cycle: (genF, thisArg) => function*() {
			while (true) {
				yield* genF.apply(thisArg, arguments);
			}
		},
		fork: (n = 2) => (genF, thisArg) => function*() {
			yield* G.nat(n).map(i => genF.apply(thisArg, arguments));
		},
		forEach: (cb, thisArg) => xgen => {
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
		toArray(xgen, cb, thisArg) {
			return Array.from(xgen, cb, thisArg);
		},
		toArray1(xgen) {
			return Array.from(xgen);
		},
		toArrayRecursive(xgen) {
			return Array.from(xgen, toArrayRecursive);
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
		},
		fill: (array, retainLength = true, cb, thisArg) => xgen => {
			const n = array.length;
			let i = 0;
			for (let x of xgen) {
				if (!retainLength || i < n) {
					array[i] = cb ? cb.call(thisArg, x, i, array, xgen) : x;
					++i;
				} else {
					break;
				}
			}
			if (!retainLength) {
				array.length = i;
			}
			return array;
		}
	});

D(Array.prototype)
	.method({
		toGenerator() {
			return G.create(this);
		},
		setLength(n) {
			this.length = toLength(n);
		},
		fillWith(xgen, retainLength = true) {
			return G.fill(this, retainLength)(xgen);
		},
		updateEach(cb, thisArg) {
			const n = this.length;
			for (let i = 0; i < n; i++) {
				this[i] = cb.call(thisArg, this[i], i, this);
			}
			return this;
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
			return G.flatMap(this)(cb, thisArg);
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
			return G.toArray(this, cb, thisArg);
		},
		toArrayRecursive() {
			return G.toArrayRecursive(this);
		},
		join(sp, cb, thisArg) {
			return G.join(sp, cb, thisArg)(this);
		},
		fill(array, retainLength = true, cb, thisArg) {
			return G.fill(array, retainLength, cb, thisArg)(this);
		}
	});

module.exports = G;