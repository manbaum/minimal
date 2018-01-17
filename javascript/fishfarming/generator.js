"use strict"

console.log("* Loading generator.js ...");

const util = require("util"),
	D = require("./property");

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
const toIndex = value => {
	let len = toInteger(value);
	return Math.min(Math.max(len, Number.MIN_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);
}
const isRegExp = x => x != null && x.constructor === RegExp;

const forceMapGet = map => {
	const getter = (key, valueMaker) => {
		if (map.has(key)) {
			return map.get(key);
		} else {
			const v = valueMaker();
			map.set(key, v);
			return v;
		}
	};
	D(getter)
		.freeze({
			map
		});
	return getter;
};

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
			return gen != null && gen.constructor === G;
		},
		isIterable(it) {
			return it != null && util.isFunction(it[Symbol.iterator]);
		},
		isArrayLike(it) {
			return it != null && it.hasOwnProperty("length");
		},
		isGeneratorFunction(genF) {
			return genF != null && genF.constructor === GeneratorFunction;
		},

		nil,
		create: function*(it) {
			if (G.isIterable(it)) {
				yield* Object(it);
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
			if (it == null) {
				return G.nil();
			} else {
				const gen = G.isGenerator(it) ? it : G.create(it);
				return cb ? G.map(cb, thisArg)(gen) : gen;
			}
		},
		from1(it) {
			return G.from(it);
		},

		xnat: (start = 0) => function*(count) {
			const nStart = toLength(start),
				nCount = toLength(count);
			for (let i = 0; i < nCount; i++) {
				yield nStart + i;
			}
		},
		nat: count => G.xnat()(count),
		xnatrev: (start = 0) => function*(count) {
			const nStart = toLength(start),
				nCount = toLength(count);
			for (let i = 0; i < nCount; i++) {
				yield nStart + (nCount - 1) - i;
			}
		},
		natrev: count => G.xnatrev()(count),
		xneg: (start = -1) => function*(count) {
			const nStart = toLength(start),
				nCount = toLength(count);
			for (let i = 0; i < nCount; i++) {
				yield nStart - i;
			}
		},
		neg: count => G.xneg()(count),
		xnegrev: (start = -1) => function*(count) {
			const nStart = toLength(start),
				nCount = toLength(count);
			for (let i = 0; i < nCount; i++) {
				yield nStart - (nCount - 1) + i;
			}
		},
		negrev: count => G.xnegrev()(count),

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
		regsplit: (sp, cb, thisArg) => function*(string) {
			if (isRegExp(sp)) {
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
			}
		},
		splitLine(lineSP = /\r\n|\n|\r/g, cb, thisArg) {
			return G.regsplit(lineSP, cb, thisArg);
		},
		wrapLine: (lineWidth = 40, indentWidth = 0, indentChar = " ") => function*(string) {
			const nLineWidth = toLength(lineWidth);
			if (nLineWidth < 1) {
				yield string;
			} else {
				const isHangingIndent = indentWidth >= 0,
					nIndentWidth = toLength(Math.abs(indentWidth)),
					indentString = indentChar.repeat(nIndentWidth);
				let toWrap = string,
					toYield = null,
					width = isHangingIndent ? nLineWidth : nLineWidth - nIndentWidth,
					isFirstLine = true;
				const update = (wrapped, rest) => {
					if (isFirstLine) {
						[toYield, width] = isHangingIndent ?
							[wrapped, nLineWidth - nIndentWidth] :
							[indentString + wrapped, nLineWidth];
						isFirstLine = false;
					} else {
						toYield = isHangingIndent ? indentString + wrapped : wrapped;
					}
					toWrap = rest;
				};
				while (true) {
					const n = toWrap.length;
					if (n == 0) {
						break;
					} else if (n < width) {
						update(toWrap);
						yield toYield;
						break;
					}

					let lastSP = n;
					while (lastSP > width) {
						lastSP = toWrap.lastIndexOf(" ", lastSP - 1);
					}
					if (lastSP < 0) {
						update(
							toWrap.substring(0, width),
							toWrap.substring(width));
					} else {
						update(
							toWrap.substring(0, lastSP),
							toWrap.substring(lastSP + 1));
					}
					yield toYield;
				}
			}
		},

		iterate: (cb, thisArg) => function*(initVal, yieldInitVal = true) {
			let x = initVal,
				i = 0;
			if (yieldInitVal) yield x;
			while (true) {
				x = cb.call(thisArg, x, i++);
				yield x;
			}
		},
		iterateWhile: (cond, condThis) => (cb, thisArg) => function*(initVal, yieldInitVal = true) {
			let x = initVal,
				i = 0;
			if (yieldInitVal) yield x;
			while (true) {
				x = cb.call(thisArg, x, i);
				if (cond.call(condThis, x, i)) yield x;
				else break;
				++i;
			}
		},
		repeat: function*(x) {
			while (true) {
				yield x;
			}
		},
		replicate: count => function*(x) {
			const nCount = toLength(count);
			for (let i = 0; i < nCount; i++) {
				yield x;
			}
		},
		cycle: (genF, thisArg) => function*() {
			while (true) {
				yield* genF.apply(thisArg, arguments);
			}
		},
		fork: (genF, thisArg) => count => function() {
			const nCount = toLength(count);
			for (let i = 0; i < nCount; i++) {
				yield* genF.apply(thisArg, arguments);
			}
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
		arraySelect(...indexes) {
			return G.map(x => indexes.map(i => x[i]));
		},
		objectSelect(...keys) {
			return G.map(x => keys.reduce(
				(ob, key) => (ob[key] = x[key], ob), {}));
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
			for (let xgen of genArray) {
				yield* xgen;
			}
		},
		concatMap: (cb, thisArg) => function*(xgen) => {
			let i = 0;
			for (let x of xgen) {
				yield* cb.call(thisArg, x, i++, xgen);
			}
		},
		fold: (cb, thisArg) => initVal => xgen => {
			let y = initVal,
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
		take: count => function*(xgen) {
			const nCount = toLength(n);
			let i = 0;
			for (let x of xgen) {
				if (i++ < nCount) yield x;
				else break;
			}
		},
		drop: count => function*(xgen) {
			const nCount = toLength(n);
			let i = 0;
			for (let x of xgen) {
				if (i < nCount) {
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
				const array = genArray.map(G.from1);
				while (true) {
					const xs = Array(n);
					for (let i = 0; i < n; i++) {
						const x = array[i].next();
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
				const array = genArray.map(G.from1);
				let j = 0;
				while (true) {
					const xs = Array(n);
					for (let i = 0; i < n; i++) {
						const x = array[i].next();
						if (x.done) return;
						else xs[i] = x.value;
					}
					yield cb.call(thisArg, xs, j++, genArray);
				}
			}
		},
		arrayGroup(cb, thisArg) {
			return G.group([])(cb, thisArg);
		},
		objectGroup(cb, thisArg) {
			return G.group({})(cb, thisArg);
		},
		group: (container) => (cb, thisArg) => xgen => {
			const get = forceArrayGet(container);
			let i = 0;
			for (let x of xgen) {
				const key = cb.call(thisArg, x, i++, xgen);
				get(key, _ => []).push(x);
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
		fill: (array, retainLength) => xgen => {
			const n = array.length;
			let i = 0;
			for (let x of xgen) {
				if (!retainLength || i < n) {
					array[i++] = x;
				} else {
					break;
				}
			}
			if (!retainLength) {
				array.length = i;
			}
			return array;
		},
		fillWith: (cb, thisArg) => (array, retainLength) => xgen {
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
		},
		uniq: function*(xgen, cb, thisArg) {
			const set = new Set();
			let i = 0;
			for (let x of xgen) {
				const y = cb ? cb.call(this.Arg, x, i++, xgen) : x;
				if (!set.has(y)) {
					set.add(y);
					yield y;
				}
			}
			set.clear();
		},
		uniq1: function(xgen) {
			return G.uniq(xgen);
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
		fill(xgen, retainLength) {
			return G.fill(this, retainLength)(xgen);
		},
		fillWith(cb, thisArg) {
			return (xgen, retainLength) => G.fillWith(cb, thisArg)(this, retainLength)(xgen);
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
		arraySelect(...indexes) {
			return G.arraySelect(...indexes)(this);
		},
		objectSelect(...keys) {
			return G.objectSelect(...keys)(this);
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
			return (initVal, yieldInitVal = true) => G.scan(cb, thisArg)(initVal, yieldInitVal)(this);
		},
		scan1(cb, thisArg) {
			return G.scan1(cb, thisArg)(this);
		},
		take(count) {
			return G.take(count)(this);
		},
		drop(count) {
			return G.drop(count)(this);
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
		arrayGroup(cb, thisArg) {
			return G.arrayGroup(cb, thisArg)(this);
		},
		objectGroup(cb, thisArg) {
			return G.objectGroup(cb, thisArg)(this);
		},
		group: container => (cb, thisArg) => {
			return G.group(container)(cb, thisArg)(this);
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
		fill(array, retainLength) {
			return G.fill(array, retainLength)(this);
		},
		fillWith(cb, thisArg) {
			return (array, retainLength) => G.fillWith(cb, thisArg)(array, retainLength)(this);
		},
		uniq(cb, thisArg) {
			return G.uniq(this, cb, thisArg);
		}
	});

module.exports = G;