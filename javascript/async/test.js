
"use strict"

var u2 = require("uglify-js");

var _async = require("./async");
var convert_f2c = _async.convert_f2c;
var convert_p2c = _async.convert_p2c;
var convert_f2p = _async.convert_f2p;
var convert_c2p = _async.convert_c2p;
var callcc_c = _async.callcc_c;
var callcc_p = _async.callcc_p;
var task = _async.task;
var async = _async.async;

var print = function() {
	[...arguments].forEach(function(v) {
		if (v && v.stack) {
			console.log(v.stack);
			while (v.cause && v.cause.stack) {
				v = v.cause;
				console.log(`caused by: ${v.stack}`);
			}
		} else {
			console.log(v);
		}
	});
};

var immediate_value = function(value) {
	return value;
};
var immediate_error = function(message) {
	throw new Error(message);
};
var promised_value = function(value) {
	return Promise.resolve(value);
};
var promised_error = function(message) {
	return Promise.reject(new Error(message));
};

var test = function*(a, b, c, d) {
	print(`--- test begin ---`);

	let va = yield immediate_value(a);
	print(`va is ${va}`);

	try {
		let vb = yield immediate_error(b);
	} catch (e) {
		if (e.message == "good") {
			return `${e.message} and bye!!`;
		} else if (e.message == "bad") {
			let ne = new Error(`${e.message} and bye!!`);
			ne.cause = e;
			throw ne;
		} else {
			print(`vb's error is ${e.message}`);
		}
	}

	let vc = yield promised_value(c);
	print(`vc is ${vc}`);

	try {
		let vd = yield promised_error(d);
	} catch (e) {
		print(`vd's error is ${e.message}`);
	}

	print(`--- test end ---`);

	return "bye!!";
};

// async(test)("ok 1", "error 2", "ok 3", "error 4")
// .then(print, print)
// .then(() => task(test)("ok 1", "good").run().promise())
// .then(print, print)
// .then(() => task(test)("ok 1", "bad").run().promise())
// .then(print, print);

var _test2 = function() {
	var a = callcc(function(cc) {
		return 5;
	});
	print("a = ${a}");
	var b = callcc(function(cc) {
		cc(6);
	});
	print("b = ${b}");
	var k = null;
	var x = callcc(function(cc) {
		k = cc;
		return 0;
	});
	print("x = ${x}");
	if (x < 5) k(x + 1);
};

var find_first_function = function(ast) {
	var found = null;
	try {
		ast.walk(new u2.TreeWalker(function(node) {
			if (node instanceof u2.AST_Function) {
				found = node;
				throw new Error("done");
			}
		}));
	} catch (ex) {}
	return found;
};

var make_var_def = function(name) {
	return new u2.AST_VarDef({
		// name: new u2.AST_SymbolVar({
		// 	name: name
		// })
		name: name
	});
};
var make_var_defs = function(defs) {
	return new u2.AST_Var({
		definitions: defs
	});
};
var make_assign = function(name, expression) {
	return new u2.AST_Assign({
		// left: new u2.AST_SymbolVar({
		// 	name: name
		// }),
		left: name,
		operator: "=",
		right: expression
	});
};
var make_colon = function() {
	let colon = new u2.AST_Token({
		value: ";",
		type: "punc"
	});
	return new u2.AST_EmptyStatement({
		start: colon,
		end: colon
	});
};
var make_function = function(argnames, body) {
	return new u2.AST_Function({
		argnames: argnames,
		body: body
	});
};

var modify_function_body = function(body) {
	let new_body = [];
	let var_defs = [];
	body.forEach(function(st) {
		if (st instanceof u2.AST_Var) {
			st.definitions.forEach(function(def) {
				var_defs.push(make_var_def(def.name));
				if (def.value) {
					new_body.push(make_assign(def.name, def.value));
					new_body.push(make_colon());
				}
			});
		} else {
			new_body.push(st);
		}
	});
	new_body.unshift(make_var_defs(var_defs));
	return new_body;
	new_body.forEach(function(n) {
		console.log(n.print_to_string({ beautify: true }));
	});
};

var testp = function() {
	let code  = "(" + _test2.toString() + ")";
	console.log(code);
	let ast = u2.parse(code);
	let first_function = find_first_function(ast);
	if (first_function != null) {
		let new_body = modify_function_body(first_function.body);
		let new_func = make_function(first_function.argnames, new_body);
		let code = new_func.print_to_string({ beautify: true, semicolons: true });
		_test2 = eval("(" + code + ")");
		console.log(_test2.toString());
	}
};

testp();

var test2c = function() {
	let a = null;
	let b = null;
	let k = null;
	let x = null;
	callcc_c(function(cc) {
		return 5;
	}, null, function(error, value) {
		a = value;
		print(`a = ${a}`);
		callcc_c(function(cc) {
			cc(null, 6);
		}, null, function(error, value) {
			b = value;
			print(`b = ${b}`);
			callcc_c(function(cc) {
				k = cc;
				return 0;
			}, null, function(error, value) {
				x = value;
				print(`x = ${x}`);
				if (x < 5) k(null, x + 1);
			});
		});
	});
};

