"use strict"

const D = require("./property");

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
const forceArrayGet = array => {
	const getter = (index, valueMaker) => {
		let v = array[index];
		if (v != null) {
			return v;
		} else {
			v = valueMaker();
			array[index] = v;
			return v;
		}
	};
	D(getter)
		.freeze({
			array
		});
	return getter;
};
const memoize = (_ => {
	const mget = forceMapGet(new WeakMap());
	return (f, thisArg) => {
		const fget = forceMapGet(mget(f, _ => new WeakMap()));
		const memoized = x => fget(x, _ => f.call(thisArg, x));
		D(memoized)
			.methos({
				callOrigin(x) {
					return f.call(thisArg, x);
				},
				renew() {
					memoized.map.clear();
					return memoized;
				}
			});
		return memoized;
	};
})();

const M = {};

D(M)
	.method({
		forceMapGet,
		forceArrayGet,
		memoize
	});

module.exports = M;