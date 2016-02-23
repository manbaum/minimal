
"use strict"

var u2 = require("uglify-js");

var convert_f2c = _async.convert_f2c;
var convert_p2c = _async.convert_p2c;
var convert_f2p = _async.convert_f2p;
var convert_c2p = _async.convert_c2p;
var callcc = _async.callcc;

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
	let node = new u2.AST_Assign({
		// left: new u2.AST_SymbolVar({
		// 	name: name
		// }),
		left: name,
		operator: "=",
		right: expression
	});
	return node;
};
var make_function = function(argnames, body) {
	return new u2.AST_Function({
		argnames: argnames,
		body: body
	});
};

var find_callcc = function(expression) {
	let found = null;
	expression.walk(new u2.TreeWalker(function(node) {
		if (node instanceof u2.AST_Call && node.expression.name == "callcc") {
			if (found == null) found = node;
		}
	}));
	return found;
};

var make_callcc = function(st, lambda, rest) {
	rest.unshift(st.transform(new u2.TreeTransformer(null, function(node){
		if (node instanceof u2.AST_Call && node.expression.name == "callcc") {
			return new u2.AST_SymbolVar({
				name: "$value$"
			});
		} else {
			return node;
		}
	})));
	rest.unshift(new u2.AST_If({
		condition: new u2.AST_SymbolVar({
			name: "$error$"
		}),
		body: new u2.AST_Throw({
			value: new u2.AST_SymbolVar({
				name: "$error$"
			})
		})
	}));
	return new u2.AST_Call({
		expression: new u2.AST_SymbolVar({
			name: "callcc"
		}),
		args: [
			lambda,
			new u2.AST_Null(),
			make_function([new u2.AST_SymbolVar({
				name: "$error$"
			}), new u2.AST_SymbolVar({
				name: "$value$"
			})], modify_function_body(rest))
		]
	});
};

var process_callcc = function(body) {
	let new_body = [];
	for (let i = 0; i < body.length; i++) {
		let st = body[i];
		var callcc = find_callcc(st);
		if (callcc) {
			let lambda = callcc.args[0];
			new_body.push(make_callcc(st, lambda, body.splice(i + 1, body.length - i - 1)));
			break;
		} else {
			new_body.push(st);
		}
	}
	return new_body;
};

var modify_function_body = function(body) {
	let new_body = [];
	let var_defs = [];
	body.forEach(function(st) {
		if (st instanceof u2.AST_Var) {
			st.definitions.forEach(function(def) {
				var_defs.push(def.name);
				if (def.value) {
					new_body.push(make_assign(def.name, def.value));
				}
			});
		} else {
			new_body.push(st);
		}
	});
	if (var_defs.length > 0) new_body.unshift(make_var_defs(var_defs));
	return process_callcc(new_body);
};

var _test2 = function() {
	var a = callcc(function(cc) {
		return callcc(function(cc) {
			return 5;
		});
	}) + callcc(function(cc) {
		return 5;
	});
	print("a = " + a);
	var b = callcc(function(cc) {
		cc(null, 6);
	});
	print("b = " + b);
	var k;
	var x = callcc(function(cc) {
		k = cc;
		return 0;
	});
	print("x = " + x);
	if (x < 5) k(null, x + 1);
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
		_test2();
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
