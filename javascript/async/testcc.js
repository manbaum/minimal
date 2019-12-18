"use strict"

var u2 = require("uglify-js");

var _t = require("./callcc");
var f2c = _t.f2c;
var p2c = _t.p2c;
var f2p = _t.f2p;
var c2p = _t.c2p;
var callcc = _t.callcc;
var callcc4c = _t.callcc4c;

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
	rest.unshift(st.transform(new u2.TreeTransformer(null, function(node) {
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



var do_transform = function(ast) {
	return ast.transform(new u2.TreeTransformer(null, function(node) {
		if (node instanceof u2.AST_Lambda) {
			return new node.CTOR({
				name: node.name,
				argnames: node.argnames,
				body: body_transform(node.body)
			});
		}
	}));
};

var body_transform = function(body) {
	let new_body = [];
	let var_defs = [];
	body.forEach(function(st) {
		if (st instanceof u2.AST_Var) {
			st.definitions.forEach(function(def) {
				var_defs.push(def.name);
				if (def.value) {
					new_body.push(new u2.AST_Assign({
						left: def.name,
						operator: "=",
						right: def.value
					}));
				}
			});
		} else {
			new_body.push(st);
		}
	});
	new_body.unshift(new u2.AST_Var({
		definitions: var_defs
	}));
	return callcc_transform(new_body);
};

var callcc_transform = function(body) {
	let new_body = [];
	for (let i = 0; i < body.length; i++) {
		let st = body[i];
		let callccs = [];
		find_all_callccs(st, callccs);
		if (callccs.length) {
			new_body.push(make_callcc(body, i, st, callccs));
			break;
		} else {
			new_body.push(st);
		}
	}
	return new_body;
};

var find_all_callccs = function(st, callccs) {
	st.walk(new u2.TreeWalker(function(node) {
		if (node instanceof u2.AST_Function) {
			return do_transform(node);
		} else if (node instanceof u2.AST_Call) {
			let name = node.expression.name;
			if (name == "callcc" || name == "callcc4c") {
				callccs.push(node);
			}
		}
	}));
};

var make_callcc = function(body, i, st, callccs) {
	var ast = null;
	var cc_body = do_transform(make_cc_body(body, i, st));
	callccs.forEach(function(callcc, j) {
		let expr = callcc.expression;
		let lambda = callcc.args ? do_transform(callcc.args[0]) : null;
		let context = callcc.args ? do_transform(callcc.args[1]) : null;
		let argnames = [
			new u2.AST_SymbolVar({
				name: "$error" + j + "$"
			}),
			new u2.AST_SymbolVar({
				name: "$value" + j + "$"
			})
		];
		if (ast) {
			let cps = new u2.AST_Function({
				argnames: argnames,
				body: [new u2.AST_Call({

				})]
			});
			ast.args[2] = cps;

		} else {
			let cps = new u2.AST_Function({
				argnames: argnames,
				body: cc_body
			});
			ast = new u2.AST_Call({
				expression: expr,
				args: [lambda, context, cps]
			});
		}
	});
	return ast;
};

var make_cc_body = function(body, i, st) {
	let rest = body.splice(i + 1, body.length - i - 1);
	let j = 0;
	rest.unshift(st.transform(new u2.TreeTransformer(null, function(node) {
		if (node instanceof u2.AST_Call) {
			let name = node.expression.name;
			if (name == "callcc" || name == "callcc4c") {
				return new u2.AST_SymbolVar({
					name: "$value" + (j++) + "$"
				});
			}
		}
	})));
	rest.unshift(make_throw(j - 1));
	return rest;
};

var make_throw = function(j) {
	let error = new u2.AST_SymbolVar({
		name: "$error" + j + "$"
	});
	return new u2.AST_If({
		condition: error,
		body: new u2.AST_Throw({
			value: error
		})
	});
};

var usecallcc = function(f) {
	let code = "(" + f.toString() + ")";
	console.log(code);
	let ast = u2.parse(code);
	let new_ast = do_transform(ast);
	let new_code = new_ast.print_to_string();
	console.log(new_code);
	return eval(new_code);
};

var _test_cc2 = function() {
	var a = callcc(function(cc) {
		return callcc(function(cc) {
			return 5;
		});
	}) + callcc(function(cc) {
		return 5;
	});
	print("a = " + a);
};

var _test_cc2_aot = function() {
	var a;
	callcc(function(cc) {
		callcc(function(cc) {
			return 5;
		}, null, function(error0, value0) {
			return cc(value0);
		});
	}, null, function(error0, value0) {
		if (error0) throw error0;
		callcc(function(cc) {}, null, function(error1, value1) {
			a = value0 + value1;
			print("a = " + a);
		});
	});
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