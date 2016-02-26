
"use strict"

let u = exports;

u.natural_numbers = function*() {
	let i = 0;
	while (true) {
		yield i++;
	}
};
u.endless_gen = function(callback, context) {
	return function*() {
		while (true) {
			yield callback.apply(context, arguments);
		}
	};
};
u.while_gen = function*(g, condition) {
	let status;
	while (true) {
		status = g.next();
		if (status.done || !condition(status.value)) break;
		yield status.value;
	}
	return status.value;
};
u.header_gen = function*(g, n) {
	yield* u.while_gen(g, () => n-- > 0);
};
u.each_of = function(g, callback, context) {
	let status = {};
	while (!status.done) {
		status = g.next();
		callback(status.value);
	}
};
u.reduce_of = function(g, callback, initial_value) {
	let sum = initial_value;
	u.each_of(g, function(item) {
		sum = callback(sum, item);
	});
	return sum;
};

u.n_of_the_year = new Date().getFullYear();
u.n_of_the_month = new Date().getMonth();
u.n_of_the_day = new Date().getDay();
u.start_of_the_day = new Date(u.n_of_the_year, u.n_of_the_month, u.n_of_the_day).getTime();
u.delta_of_the_day = () => new Date().getTime() - u.start_of_the_day;
u.random_alpha = () => String.fromCharCode(Math.random() * 26 + (Math.random() > 0.5 ? 65 : 97));
u.random_word = (n) => u.reduce_of(u.header_gen(u.natural_numbers(), n), (w) => w + u.random_alpha(), "");
u.str_right = (s, n) => s.substr(s.length - n, s.length);
u.unique_id = () => u.random_word(6) + u.str_right(String(u.delta_of_the_day()), 6);
u.make_name = (a, b) => a + u.unique_id() + b;
u.name_gen = (a, b) => u.endless_gen(u.make_name).bind(null, a || "", b || "");
