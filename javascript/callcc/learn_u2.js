
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
const n_of_the_year = new Date().getFullYear();
const n_of_the_month = new Date().getMonth();
const n_of_the_day = new Date().getDay();
const start_of_the_day = new Date(n_of_the_year, n_of_the_month, n_of_the_day).getTime();
const delta_of_the_day = () => new Date().getTime() - start_of_the_day;
const random_alpha = () => String.fromCharCode(Math.random() * 26 + (Math.random() > 0.5 ? 65 : 97));
const random_word = (n) => reduce_of(header_gen(natural_numbers(), n), (w) => w + random_alpha(), "");
const str_right = (s, n) => s.substr(s.length - n, s.length);
const unique_id = () => random_word(6) + str_right(String(delta_of_the_day()), 6);
const name_gen = (a, b) => endless_gen(function() { return this.a + unique_id() + this.b; }, { a: a || "", b: b || "" });

const general_names = name_gen("_")();
const cps_names = name_gen("_cps_")();
const error_names = name_gen("_err_")();
const value_names = name_gen("_val_")();

const u2ast = {};
u2ast.null = new u2.AST_Null();
u2ast.nan = new u2.AST_NaN();
u2ast.undefined = new u2.AST_Undefined();
u2ast.inf = new u2.AST_Infinity();
u2ast.true = new u2.AST_True();
u2ast.false = new u2.AST_False();
u2ast.empty = new u2.AST_EmptyStatement();
u2ast.number = (n) => new u2.AST_Number({ value: n });
u2ast.string = (s) => new u2.AST_String({ value: s });
u2ast.regexp = (r) => new u2.AST_RegExp({ value: r });
u2ast.symbol_var = (name) => new u2.AST_SymbolVar({ name: name });
u2ast.symbol_ref = (name) => new u2.AST_SymbolRef({ name: name });
u2ast.var = (definitions) => new u2.AST_Var({ definitions: definitions });
u2ast.vardef = (name, value) => new u2.AST_VarDef({ name: name, value: value });
u2ast.simple = (body) => new u2.AST_SimpleStatement({ body: body });
u2ast.binary = (left, op, right) => new u2.AST_Assign({ left: left, operator: op, right: right });
u2ast.assign = (left, right) => new u2.AST_Assign({ left: left, operator: "=", right: right });
u2ast.if = (cond, bthen, belse) => new u2.AST_If({ condition: cond, body: bthen, alternative: belse });
u2ast.try = (btry, bcatch, bfinally) => new u2.AST_Try({ body: btry, bcatch: bcatch, bfinally: bfinally });
u2ast.catch = (argname, body) => new u2.AST_Catch({ argname: argname, body: body });
u2ast.finally = (body) => new u2.AST_Finally({ body: body });
u2ast.return = (value) => new u2.AST_Return({ value: value });
u2ast.throw = (value) => new u2.AST_Throw({ value: value });
u2ast.function = (name, argnames, body) => new u2.AST_Function({ name: name, argnames: argnames, body: body });
u2ast.call = (expr, args) => new u2.AST_Call({ expression: expr, args: args });
u2ast.block = (body) => new u2.AST_BlockStatement({ body: body });


const u2_shallow_cpsify = function(func) {
	let name = func.name ? "cps$" + func.name : null;
	let cps_name = cps_names.next().value;
	let cps_node = u2ast.symbol_var(cps_name);
	let argnames = func.argnames ? [...func.argnames, cps_node] : [cps_node];
	let error_name = error_names.next().value;
	let error_node = u2ast.symbol_var(error_name);

	let bcatch = u2ast.catch(error_node, [u2ast.simple(u2ast.call(cps_node, [error_node]))]);
	let btry = [u2ast.simple(u2ast.call(cps_node, [u2ast.null, u2ast.call(func, func.argnames)]))];
	return u2ast.function(name, argnames, [u2ast.try(btry, bcatch)]);
};

const u2_assign_block = function(error_node, value_node) {
	return function(error, value) {
		let e = u2ast.simple(u2ast.assign(error_node, error));
		let v = u2ast.simple(u2ast.assign(value_node, value));
		return u2ast.block([e, v, u2ast.return()]);
	};
};
const u2_result_block = function(cps_node, error_node, value_node) {
	let e = u2ast.simple(u2ast.call(cps_node, [error_node]));
	let v = u2ast.simple(u2ast.call(cps_node, [u2ast.null, value_node]));
	return u2ast.if(error_node, e, v);
};
const u2_try_block = function(cps_node, error_node, value_node, body) {
	let ex_name = error_names.next().value;
	let ex_node = u2ast.symbol_var(ex_name);
	let bc = [u2ast.simple(u2ast.assign(error_node, ex_node))];
	let bf = [u2_result_block(cps_node, error_node, value_node)];
	return u2ast.try(body, u2ast.catch(ex_node, bc), u2ast.finally(bf));
};
const u2_cpsify = function(func) {
	let name = func.name ? "cps$" + func.name : null;
	let cps_name = cps_names.next().value;
	let cps_node = u2ast.symbol_var(cps_name);
	let argnames = func.argnames ? [...func.argnames, cps_node] : [cps_node];
	let error_name = error_names.next().value;
	let error_node = u2ast.symbol_var(error_name);
	let value_name = value_names.next().value;
	let value_node = u2ast.symbol_var(value_name);
	let make_assign = u2_assign_block(error_node, value_node);
	let transformer = new u2.TreeTransformer(function(node) {
		if (node instanceof u2.AST_Function) {
			return u2_cpsify(node);
		}
	}, function(node) {
		if (node instanceof u2.AST_Return) {
			let e = u2ast.simple(u2ast.assign(error_node, u2ast.null));
			let v = u2ast.simple(u2ast.assign(value_node, node.value));
			return u2ast.block([e, v, u2ast.return()]);
		} else if (node instanceof u2.AST_Throw) {
			let e = u2ast.simple(u2ast.assign(error_node, node.value));
			return u2ast.block([e, u2ast.return()]);
		}
	});
	let transformer2 = new u2.TreeTransformer(null, function(node) {
		if (node instanceof u2.AST_Try) {
			let n = node.body.length;
			if (n > 0 && node.body[n - 1] instanceof u2.AST_BlockStatement) {
				node.body.splice(n - 1, 1, ...node.body[n - 1].body);
			}
			n = node.body.length;
			if (node.body[n - 1] instanceof u2.AST_Return) {
				node.body.splice(n - 1, 1);
			}
		}
	});
	let new_body = func.body.map((st) => st.transform(transformer)).map((st) => st.transform(transformer2));
	let var_st = u2ast.var([error_node, value_node]);
	let try_st = u2_try_block(cps_node, error_node, value_node, new_body);
	return u2ast.function(name, argnames, [var_st, try_st]);
};

const u2_impl_callcc = function(func) {
	let new_body = u2_process_body(func.body);
	return u2ast.function(func.name, func.argnames, new_body);
};
const u2_process_body = function(body) {
	let new_body = [];
	for (let i = 0; i < body.length; i++) {
		let st = body[i];

	}
	return new_body;
};


var print_ast = function(ast, raw) {
	console.log(ast.print_to_string({ beautify: !raw }));
};
const u2_comp = u2.Compressor({side_effects:false});
var u2_min = function(code) {
	let ast = u2.parse("(" + code + ")");
	ast.figure_out_scope();
	ast.compute_char_frequency();
	ast.mangle_names();
	// let new_ast = ast.transform(u2_comp);
	return ast.body[0].body;
};

var test = function(a) {
	return function() {
		if (a > 0) return a;
		else throw new Error("should be greater than 0");
	};
};

var test3 = function(a) {
	return a + uncps(f)(a) + uncps(function(a, cps) {
		cps(a + 5);
	})(a);
};
var _test2 = function() {
	var a = callcc(function(cc) {
		k1 = cc;
		return callcc(function(cc) {
			k2 = cc;
			return 5;
		});
	}) + callcc(function(cc) {
		k3 = cc;
		return 5;
	});
	console.log(new Error().stack);
	print("a = " + a);
	var b = callcc(function(cc) {
		var f = 6;
		cc(null, f);
	});
	print("b = " + b);
	var k;
	var x = callcc(function(cc) {
		k4 = k = cc;
		return 0;
	});
	print("x = " + x);
	if (x < 5) k(null, x + 1);
	var y = callcc(function(cc) {
		(function(callback) {
			// callback(5);
			throw new Error("gaga!");
		})(function(value) {
			cc(value);
		});
	});
};

var code = "(" + _test2.toString() + ")";
var ast = u2.parse(code);
// console.log(ast);
var f = ast.body[0].body;
var new_ast = u2_cpsify(f);
// console.log(new_ast);
print_ast(new_ast);
var min_ast = u2_min(new_ast.print_to_string());
print_ast(min_ast);