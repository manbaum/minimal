"use strict"

const D = target => (_ => {
	const self = {
		target
	};

	const define = (props, enumerable = true, writable = false, configurable = true) => {
		Reflect.ownKeys(props).forEach(
			name => {
				if (name.startsWith("GET_")) {
					const get = props[name.substring(4)];
					Object.defineProperty(target, name, {
						get,
						enumerable,
						writable,
						configurable
					});
				} else if (name.startsWith("GET_")) {
					const set = props[name.substring(4)];
					Object.defineProperty(target, name, {
						set,
						enumerable,
						writable,
						configurable
					});
				} else {
					const value = props[name];
					Object.defineProperty(target, name, {
						value,
						enumerable,
						writable,
						configurable
					});
				}
			});
		return self;
	};
	const value = (props, enumerable = true, writable = false, configurable = true) => {
		Reflect.ownKeys(props).forEach(
			name => {
				const value = props[name];
				Object.defineProperty(target, name, {
					value,
					enumerable,
					writable,
					configurable
				});
			});
		return self;
	};
	const getter = (props, enumerable = true, writable = false, configurable = true) => {
		Reflect.ownKeys(props).forEach(
			name => {
				const get = props[name];
				Object.defineProperty(target, name, {
					get,
					enumerable,
					writable,
					configurable
				});
			});
		return self;
	};
	const setter = (props, enumerable = true, writable = false, configurable = true) => {
		Reflect.ownKeys(props).forEach(
			name => {
				const set = props[name];
				Object.defineProperty(target, name, {
					set,
					enumerable,
					writable,
					configurable
				});
			});
		return self;
	};
	const method = (props, enumerable = false, writable = true, configurable = true) => {
		return value(props, enumerable, writable, configurable);
	};
	const freeze = (props, enumerable = false, writable = false, configurable = false) => {
		return value(props, enumerable, writable, configurable);
	};

	return Object.assign(self, {
		define,
		value,
		getter,
		setter,
		method,
		freeze
	});
})();

module.exports = D;