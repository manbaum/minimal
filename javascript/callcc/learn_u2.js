
"use strict"

const u2 = require("uglify-js");

const natural_numbers = function*() {
	let i = 0;
	while (true) {
		yield i++;
	}
};
const endless_gen = function(callback, context) {
	return function*() {
		while (true) {
			yield callback.apply(context, arguments);
		}
	};
};
const while_gen = function*(g, condition) {
	let status;
	while (true) {
		status = g.next();
		if (status.done || !condition(status.value)) break;
		yield status.value;
	}
	return status.value;
};
const header_gen = function*(g, n) {
	yield* while_gen(g, () => n-- > 0);
};
const each_of = function(g, callback, context) {
	let status = {};
	while (!status.done) {
		status = g.next();
		callback(status.value);
	}
};
const reduce_of = function(g, callback, initial_value) {
	let sum = initial_value;
	each_of(g, function(item) {
		sum = callback(sum, item);
	});
	return sum;
};
const random_alpha = () => String.fromCharCode(Math.random() * 26 + (Math.random() > 0.5 ? 65 : 97));
const random_word = (n) => reduce_of(header_gen(natural_numbers(), n), (w) => w + random_alpha(), "");
const n_of_the_year = new Date().getFullYear();
const n_of_the_month = new Date().getMonth();
const n_of_the_day = new Date().getDay();
const start_of_the_day = new Date(n_of_the_year, n_of_the_month, n_of_the_day).getTime();
const delta_of_the_day = () => new Date().getTime() - start_of_the_day;
const right = (s, n) => s.substr(s.length - n, s.length);
const unique_id = () => random_word(6) + right(String(delta_of_the_day()), 6);
const name_gen = (a, b) => endless_gen(function() { return this.a + unique_id() + this.b; }, { a: a || "", b: b || "" });

const general_names = name_gen("_")();
const cps_names = name_gen("_cps_")();
const error_names = name_gen("_err_")();
const value_names = name_gen("_val_")();

const u2ast = {};
u2ast.null = new u2.AST_Null();
u2ast.symbol_var = (name) => new u2.AST_SymbolVar({ name: name });
u2ast.symbol_ref = (name) => new u2.AST_SymbolRef({ name: name });
u2ast.empty = () => new u2.AST_EmptyStatement;
u2ast.simple = (body) => new u2.AST_SimpleStatement({ body: body });
u2ast.if = (cond, bthen, belse) => new u2.AST_If({ condition: cond, body: bthen, alternative: belse });
u2ast.try = (btry, bcatch, bfinally) => new u2.AST_Try({ body: btry, bcatch: bcatch, bfinally: bfinally });
u2ast.catch = (argname, body) => new u2.AST_Catch({ argname: argname, body: body });
u2ast.finally = (body) => new u2.AST_Finally({ body: body });
u2ast.function = (name, argnames, body) => new u2.AST_Function({ name: name, argnames: argnames, body: body });
u2ast.call = (expr, args) => new u2.AST_Call({ expression: expr, args: args });


const u2_cpsify = function(ast_func) {
	let name = ast_func.name ? "cps$" + ast_func.name : null;
	let cps_name = cps_names.next().value;
	let cps_node = u2ast.symbol_var(cps_name);
	let argnames = ast_func.argnames ? [...ast_func.argnames, cps_node] : [cps_node];
	let error_name = error_names.next().value;
	let error_node = u2ast.symbol_var(error_name);

	let bcatch = u2ast.catch(error_node, [u2ast.simple(u2ast.call(cps_node, [error_node]))]);
	let btry = [u2ast.simple(u2ast.call(cps_node, [u2ast.null, u2ast.call(ast_func, ast_func.argnames)]))];
	return u2ast.function(name, argnames, [u2ast.try(btry, bcatch)]);
};

const u2_create_cc = function(ast_st, rest) {

};

var print_ast = function(ast) {
	console.log(ast.print_to_string({ beautify: true }));
};
const u2_comp = u2.Compressor({side_effects:false});
var u2_min = function(code) {
	let ast = u2.parse("(" + code + ")");
	ast.figure_out_scope();
	ast.compute_char_frequency();
	ast.mangle_names();
	let new_ast = ast.transform(u2_comp);
	return new_ast;
};

var test = function(a) {
	return a;
};


var code = "(" + test.toString() + ")";
var ast = u2.parse(code);
// console.log(ast);
var f = ast.body[0].body;
var new_ast = u2_cpsify(f);
// console.log(new_ast);
print_ast(new_ast);
var min_ast = u2_min(new_ast.print_to_string());
print_ast(min_ast);
