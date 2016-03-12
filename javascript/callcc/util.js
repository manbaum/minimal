
"use strict"

let u = exports;

u.natural_numbers = function*() {
	let i = 0;
	while (true) {
		yield i++;
	}
};
u.endless = function(callback, context) {
	return function*() {
		while (true) {
			yield callback.apply(context, arguments);
		}
	};
};
u.while = function(condition) {
	return function*(g) {
		let status;
		while (true) {
			status = g.next();
			if (status.done || !condition(status.value)) break;
			yield status.value;
		}
		return status.value;
	}
};
u.take = function(n) {
	return function*(g) {
		yield* u.while(() => n-- > 0)(g);
	};
};
u.each = function(g, callback, context) {
	while (true) {
		let status = g.next();
		if (status.done) break;
		callback(status.value);
	}
};
u.reduce = function(g, callback, initial_value) {
	let sum = initial_value;
	u.each(g, function(item) {
		sum = callback(sum, item);
	});
	return sum;
};

let str_right = (s, n) => s.substr(s.length - n, s.length);

u.n_of_the_year = new Date().getFullYear();
u.n_of_the_month = new Date().getMonth();
u.n_of_the_day = new Date().getDay();
u.start_of_the_day = new Date(u.n_of_the_year, u.n_of_the_month, u.n_of_the_day).getTime();
u.delta_of_the_day = () => new Date().getTime() - u.start_of_the_day;
u.random_alpha = () => String.fromCharCode(Math.random() * 26 + (Math.random() > 0.5 ? 65 : 97));
u.random_word = (n) => u.reduce(u.take(n)(u.natural_numbers()), (w) => w + u.random_alpha(), "");
u.unique_id = () => u.random_word(6) + str_right(String(u.delta_of_the_day()), 6);
u.make_name = (a, b) => a + u.unique_id() + b;
u.name_gen = (a, b) => u.endless(u.make_name).bind(null, a || "", b || "");
