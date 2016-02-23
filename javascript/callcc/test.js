
"use strict"

var u2 = require("uglify-js");
var callcc = require("./callcc").callcc;

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

var use_callcc = function(f) {
	let code = "(" + f.toString() + ")";
	console.log(code);
	let ast = u2.parse(code);
	let new_ast = do_rewrite(ast);
	let new_code = new_ast.print_to_string({ beautify: true });
	console.log(new_code);
	return eval(new_code);
};

var do_rewrite = function(ast) {
	return ast.transform(new u2.TreeTransformer(function(node) {
		if (node instanceof u2.AST_Function) {
			return new u2.AST_Function({
				name: node.name,
				argnames: node.argnames,
				body: rewrite_function_body(node.body)
			});
		}
	}));
};

var rewrite_function_body = function(body) {
	let new_body = [];
	let var_defs = [];
	for (let i = 0; i < body.length; i++) {
		let st = body[i];
		if (st instanceof u2.AST_Var) {
			st.definitions.forEach(function(def) {
				var_defs.push(def.name);
				if (def.value) new_body.push(new u2.AST_Assign({
					left: def.name,
					operator: "=",
					right: def.value
				}));
			});
		} else {
			new_body.push(st);
		}
	}
	if (var_defs.length) new_body.unshift(new u2.AST_Var({ definitions: var_defs }));
	return find_and_rewrite_callcc(new_body);
};

var find_and_rewrite_callcc = function(body) {
	let new_body = [];
	for (let i = 0; i < body.length; i++) {
		let st = body[i];
		let callccs = find_callcc(st);
		if (callccs.length) {
			let rest = body.slice(i + 1);
			let new_st = rewrite_callcc(st, callccs, rest);
			new_body.push(new_st);
			break;
		} else {
			new_body.push(st);
		}
	}
	return new_body;
};

var find_callcc = function(st) {
	let callccs = [];
	st.walk(new u2.TreeWalker(function(node) {
		if (node instanceof u2.AST_Function) {
			return true;
		} else if (node instanceof u2.AST_Call) {
			let name = node.expression.name;
			if (name == "callcc" || name == "callcc4c") {
				callccs.push(node);
			}
		}
	}));
	return callccs;
};

var rewrite_callcc = function(st, callccs, rest) {
	let new_st, last, cps;
	callccs.forEach(function(c, i) {
		let lambda = new u2.AST_Function({
			name: c.args[0].name,
			argnames: c.args[0].argnames,
			body: rewrite_function_body(c.args[0].body)
		});
		let context = c.args[1] ? c.args[1] : new u2.AST_Null();
		let argnames = [
			new u2.AST_SymbolVar({ name: "$error" + i + "$" }),
			new u2.AST_SymbolVar({ name: "$value" + i + "$" })
		];
		if (!new_st) {
			last = cps = rewrite_return_and_throw(new u2.AST_Function({
				argnames: argnames,
				body: rewrite_function_body(add_rewrited_statement(rest, st, i))
			}));
			new_st = new u2.AST_Call({
				expression: c.expression,
				args: [lambda, context, cps]
			});
		} else {
			cps = new u2.AST_Function({
				argnames: argnames,
				body: last.body
			});
			let var_name = new u2.AST_SymbolVar({ name: "$error" + (i - 1) + "$" });
			last.body = [
				new u2.AST_If({
					condition: var_name,
					body: new u2.AST_Throw({ value: var_name })
				}),
				new u2.AST_Call({
					expression: c.expression,
					args: [lambda, context, cps]
				})
			];
			last = cps;
		}
	});
	return new_st;
};

var add_rewrited_statement = function(body, st, j) {
	let  i = 0;
	body.unshift(st.transform(new u2.TreeTransformer(function(node) {
		if (node instanceof u2.AST_Call) {
			let name = node.expression.name;
			if (name == "callcc" || name == "callcc4c") {
				return new u2.AST_SymbolVar({ name: "$value" + (i++) + "$" });
			}
		}
	})));
	var var_name = new u2.AST_SymbolVar({ name: "$error" + j + "$" });
	body.unshift(new u2.AST_If({
		condition: var_name,
		body: new u2.AST_Throw({ value: var_name })
	}));
	return body;
};

var rewrite_return_and_throw = function(cc) {
	return cc.transform(new u2.TreeTransformer(function(node) {
		if (node != cc && node instanceof u2.AST_Function) {
			return node;
		} else if (node instanceof u2.AST_Return) {
			node.value = new u2.AST_Call({
				expression: new u2.AST_SymbolVar({ name: "cc" }),
				args:[
					new u2.AST_Null(),
					node.value
				]
			});
			return node;
		} else if (node instanceof u2.AST_Throw) {
			return new u2.AST_Return({
				value: new u2.AST_Call({
					expression: new u2.AST_SymbolVar({ name: "cc" }),
					args:[node.value]
				})
			});
		}
	}));
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
		var f = 6;
		cc(null, f);
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
var __test2 = function() {
	callcc(function(cc) {
		return callcc(function(cc) {
			return 5;
		});
	}, null, function(e0, v0) {
		callcc(function(cc) {
			return 5;
		}, null, function(e1, v1) {
			var a = v0 + v1;
			print("a = " + a);
			var b = callcc(function(cc) {
				var f = 6;
				cc(null, f);
			});
			print("b = " + b);
			var k;
			var x = callcc(function(cc) {
				k = cc;
				return 0;
			});
			print("x = " + x);
			if (x < 5) k(null, x + 1);
		});
	});
};
let t = use_callcc(_test2);
let print = console.log;
t();
