"use strict"

const D = require("./property"),
	G = require("./generator");

prime = n => n < 3 ? G.of(2) : G.concat(G.of(2), G.iterate(i => i + 2)(3).takeWhile(i => i <= n).filter(i => (q => G.iterate(i => i + 2)(3).takeWhile(i => i <= q))(Math.floor(Math.sqrt(i))).every(j => i % j != 0)));
watch = f => (begin => (_ => Date.now() - begin)(f()))(Date.now());
f = n => m => G.iterate(_ => watch(_ => prime(n).forEach(_ => _)))(0, 0).take(m).reduce((x, y) => x + y) / m;

const expect = msg => x => y => {
	if (x != y) throw new Error(msg + `, expect ${x} but ${y}`);
};
const expectNot = msg => x => y => {
	if (x == y) throw new Error(msg + `, expect not ${x} but ${y}`);
};
const assertTrue = msg => b => {
	expect(msg)(true)(b);
};
const assertFalse = msg => b => {
	expect(msg)(false)(b);
};

const execute = tests => {
	const stat = Object.getOwnPropertyNames(tests).reduce(
		(m, name) => {
			const f = tests[name];
			try {
				console.log(`\n- Testing ${name} ...`);
				m.total++;
				f();
				console.log(`. Passed! ${name}`);
				m.passed++;
			} catch (ex) {
				console.log(`* Exception caught when testing ${name}`);
				console.error(ex);
				console.log(`* Failed! ${name}`);
				m.failed++;
			}
			return m;
		}, {
			total: 0,
			passed: 0,
			failed: 0
		});
	console.log(`\n- Total ${stat.total} test(s) executed, ${stat.passed} passed, ${stat.failed} failed.`);
};

const wrapLine = (lineWidth, indent = 4) => s => {
	const fillin = "\n" + " ".repeat(indent);
	const append = (wrapped, toAppend) => {
		return wrapped + (wrapped.length > 0 ? fillin : "") + toAppend;
	};
	const wrapRecursive = (wrapped, toWrap) => {
		const n = toWrap.length,
			width = wrapped.length > 0 ? lineWidth - indent : lineWidth;
		if (n == 0) {
			return wrapped;
		} else if (n < width) {
			return append(wrapped, toWrap);
		} else {
			let lastSP = n;
			while (lastSP > width) {
				lastSP = toWrap.lastIndexOf(" ", lastSP - 1);
			}
			if (lastSP < 0) {
				return wrapRecursive(
					append(wrapped, toWrap.substring(0, width - 2) + " \\"),
					toWrap.substring(width - 2));
			} else {
				return wrapRecursive(
					append(wrapped, toWrap.substring(0, lastSP), wrapped),
					toWrap.substring(lastSP + 1));
			}
		}
	};
	return wrapRecursive("", s);
};

const checkIf = msg => {
	return {
		on(f) {



		}
	};
};

const Tests_G = {};
D(Tests_G)
	.method({
		isGenerator() {
			assertTrue(`Check if G.nil() is a Generator`)
				(!!G.isGenerator(G.nil()));
			assertFalse(`Check if G.nil is a Generator`)
				(!!G.isGenerator(G.nil));
			assertFalse(`Check if undefined is a Generator`)
				(!!G.isGenerator());
			assertFalse(`Check if null is a Generator`)
				(!!G.isGenerator(null));
		},
		isIterable() {
			assertTrue(`Check if G.nil() is iterable`)
				(!!G.isIterable(G.nil()));
			assertFalse(`Check if G.nil is a iterable`)
				(!!G.isIterable(G.nil));
			assertTrue(`Check if [1, 2, 3] is iterable`)
				(!!G.isIterable([1, 2, 3]));
			assertTrue(`Check if "This is a String" is iterable`)
				(!!G.isIterable("This is a String"));
			assertFalse(`Check if undefined is a iterable`)
				(!!G.isIterable());
			assertFalse(`Check if null is a iterable`)
				(!!G.isIterable(null));
			assertFalse(`Check if {} is a iterable`)
				(!!G.isIterable({}));
			assertTrue(`Check if { [Symbol.iterator]: G.nil } is a iterable`)
				(!!G.isIterable({
					[Symbol.iterator]: G.nil
				}));
		},
		isArrayLike() {
			assertFalse(`Check if G.nil() is array-like`)
				(!!G.isArrayLike(G.nil()));
			assertFalse(`Check if G.nil is a array-like`)
				(!!G.isArrayLike(G.nil));
			assertTrue(`Check if [1, 2, 3] is array-like`)
				(!!G.isArrayLike([1, 2, 3]));
			assertTrue(`Check if "This is a String" is array-like`)
				(!!G.isArrayLike("This is a String"));
			assertFalse(`Check if undefined is a array-like`)
				(!!G.isArrayLike());
			assertFalse(`Check if null is a array-like`)
				(!!G.isArrayLike(null));
		},
		isGeneratorFunction() {
			// TODO isGeneratorFunction
		},
		create() {
			// TODO create
		},
		of() {
			// TODO of
		},
		from() {
			// TODO from
		},
		from1() {
			// TODO from1
		},
		nil() {
			// TODO nil
		},
		xnat() {
			// TODO xnat
		},
		nat() {
			// TODO nat
		},
		xnatrev() {
			// TODO xnatrev
		},
		natrev() {
			// TODO natrev
		},
		xneg() {
			// TODO xneg
		},
		neg() {
			// TODO neg
		},
		xnegrev() {
			// TODO xnegrev
		},
		negrev() {
			// TODO negrev
		},
		regexec() {
			// TODO regexec
		},
		split() {
			// TODO split
		},
		iterate() {
			// TODO iterate
		},
		repeat() {
			// TODO repeat
		},
		replicate() {
			// TODO replicate
		},
		cycle() {
			// TODO cycle
		},
		fork() {
			// TODO fork
		},
		forEach() {
			// TODO forEach
		},
		map() {
			// TODO map
		},
		flatMap() {
			// TODO flatMap
		},
		select() {
			// TODO select
		},
		find() {
			// TODO find
		},
		findIndex() {
			// TODO findIndex
		},
		filter() {
			// TODO filter
		},
		and() {
			// TODO and
		},
		or() {
			// TODO or
		},
		every() {
			// TODO every
		},
		some() {
			// TODO some
		},
		concat() {
			// TODO concat
		},
		concatMap() {
			// TODO concatMap
		},
		fold() {
			// TODO fold
		},
		fold1() {
			// TODO fold1
		},
		reduce() {
			// TODO reduce
		},
		scan() {
			// TODO scan
		},
		scan1() {
			// TODO scan1
		},
		take() {
			// TODO take
		},
		drop() {
			// TODO drop
		},
		takeWhile() {
			// TODO takeWhile
		},
		dropWhile() {
			// TODO dropWhile
		},
		zip() {
			// TODO zip
		},
		zipWith() {
			// TODO zipWith
		},
		group() {
			// TODO group
		},
		group2() {
			// TODO group2
		},
		collapse() {
			// TODO collapse
		},
		toArray() {
			// TODO toArray
		},
		toArray1() {
			// TODO toArray1
		},
		toArrayRecursive() {
			// TODO toArrayRecursive
		},
		join() {
			// TODO join
		},
		fill() {
			// TODO fill
		},
	});

execute(Tests_G);