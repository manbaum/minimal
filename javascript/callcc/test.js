
"use strict"

var u2 = require("uglify-js");
var _callcc = require("./callcc");
var callcc = _callcc.callcc;
var c2p = _callcc.c2p;

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
	let new_ast = do_rewrite(0, ast);
	let new_code = new_ast.print_to_string({ beautify: true });
	console.log(new_code);
	return eval(new_code);
};

var do_rewrite = function(l, ast) {
	return ast.transform(new u2.TreeTransformer(function(node) {
		if (node instanceof u2.AST_Function) {
			node.body = rewrite_function_body(l, node.body);
			return node;
		}
	}));
};

var rewrite_function_body = function(l, body) {
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
	if (var_defs.length) {
		new_body.unshift(new u2.AST_Var({ definitions: var_defs }));
	}
	return find_and_rewrite_callcc(l, new_body);
};

var find_and_rewrite_callcc = function(l, body) {
	let new_body = [];
	for (let i = 0; i < body.length; i++) {
		let st = body[i];
		let callccs = find_callcc(l, st);
		if (callccs.length) {
			let rest = rewrite_function_body(l + 1, body.slice(i + 1));
			let new_st = rewrite_callcc(l, st, callccs, rest);
			new_body.push(new_st);
			break;
		} else {
			new_body.push(st);
		}
	}
	return new_body;
};

var find_callcc = function(l, st) {
	let callccs = [];
	st.walk(new u2.TreeWalker(function(node) {
		if (node instanceof u2.AST_Function) {
			return true;
		} else if (node instanceof u2.AST_Call && node.expression.name == "callcc") {
			callccs.push(node);
		}
	}));
	return callccs;
};

var make_name = function(l, i, type) {
	return new u2.AST_SymbolVar({ name: "$" + l + type + i + "$" });
};

var rewrite_callcc = function(l, st, callccs, rest) {
	let new_st, last, cps;
	callccs.forEach(function(c, i) {
		let lambda = do_rewrite(l, rewrite_return_and_throw(l, i, c.args[0]));
		let context = c.args[1] ? c.args[1] : new u2.AST_Null();
		let argnames = [ make_name(l, i, "error"), make_name(l, i, "value") ];
		if (!new_st) {
			last = cps = new u2.AST_Function({
				argnames: argnames,
				body: rewrite_statement(l, i, st, rest, c.args[0].argnames[0])
			});
			new_st = new u2.AST_Call({
				expression: c.expression,
				args: [lambda, context, cps]
			});
		} else {
			cps = new u2.AST_Function({
				argnames: argnames,
				body: last.body
			});
			let var_name = make_name(l, i - 1, "error");
			last.body = rewrite_return_and_throw(l, i, [new u2.AST_If({
				condition: var_name,
				body: new u2.AST_Throw({ value: var_name }),
				alternative: new u2.AST_Call({
					expression: c.expression,
					args: [lambda, context, cps]
				})
			})], cc_name);
			last = cps;
		}
	});
	return new_st;
};

var rewrite_statement = function(l, i, st, body, cc_name) {
	let  j = 0;
	body.unshift(st.transform(new u2.TreeTransformer(function(node) {
		if (node instanceof u2.AST_Call && node.expression.name == "callcc") {
			return make_name(l, j++, "value");
		}
	})));
	let var_name = make_name(l, i, "error");
	let new_st = new u2.AST_If({
		condition: var_name,
		body: new u2.AST_Throw({ value: var_name }),
		alternative: new u2.AST_BlockStatement({ body: body })
	});
	return rewrite_return_and_throw(l, i, [new_st], cc_name);
};

var rewrite_return_and_throw = function(l, i, lambda) {
	return lambda.transform(new u2.TreeTransformer(function(node) {
		if (node instanceof u2.AST_Function) {
			return node;
		} else if (node instanceof u2.AST_Return) {
			node.value = new u2.AST_Call({
				expression: lambda.argnames[0],
				args:[ new u2.AST_Null(), node.value ]
			});
			return node;
		} else if (node instanceof u2.AST_Throw) {
			return new u2.AST_Return({
				value: new u2.AST_Call({
					expression: lambda.argnames[0],
					args:[node.value]
				})
			});
		}
	}));
};
var k1, k2, k3, k4;
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


var _test2_cpsify = function(cps) {
	try {
		cps(null, (function() {
			var a = callcc(function(cc, cps) {
				try {
					cps(null, (function(cc) {
						return callcc(function(cc, cps) {
							try {
								cps(null, (function(cc) {
									return 5;
								})(cc));
							} catch (error) {
								cps(error);
							}
						});
					})(cc));
				} catch (error) {
					cps(error);
				}
			}) + callcc(function(cc, cps) {
				try {
					cps(null, (function(cc) {
						return 5;
					})(cc));
				} catch (error) {
					cps(error);
				}
			});
			console.log(new Error().stack);
			print("a = " + a);
			var b = callcc(function(cc, cps) {
				try {
					cps(null, (function(cc) {
						var f = 6;
						cc(null, f);
					})(cc));
				} catch (error) {
					cps(error);
				}
			});
			print("b = " + b);
			var k;
			var x = callcc(function(cc, cps) {
				try {
					cps(null, (function(cc) {
						k = cc;
						return 0;
					})(cc));
				} catch (error) {
					cps(error);
				}
			});
			print("x = " + x);
			if (x < 5) k(null, x + 1);
			var y = callcc(function(cc, cps) {
				try {
					cps(null, (function(cc) {
						(function(callback) {
							// callback(5);
							throw new Error("gaga!");
						})(function(value) {
							cc(value);
						});
					})(cc));
				} catch (error) {
					cps(error);
				}
			});
		})(cps));
	} catch (error) {
		cps(error);
	}
};
var _test2_callccify = function(cps) {
	callcc4c(function(cc, cps) {
		try {
			cps(null, (function(cc, cps) {
				function(cc) {
				return callcc4c(f2c(function(cc) {
					return 5;
				}));
			})(cc));
		} catch (error) {
			cps(error);
		}
	}), null, function(e0, v0) {
		callcc4c(f2c(function(cc) {
			return 5;
		}), null, function(e1, v1) {
			var a = v0 + v1;
			console.log(new Error().stack);
			print("a = " + a);
			var b = callcc(f2c(function(cc) {
				var f = 6;
				cc(null, f);
			}));
			print("b = " + b);
			var k;
			var x = callcc(f2c(function(cc) {
				k = cc;
				return 0;
			}));
			print("x = " + x);
			if (x < 5) k(null, x + 1);
		});
	});
};
let t = use_callcc(_test2);
let print = console.log;
// t();
let tt = function() {
    var a, b, k, x;
    callcc(function(cc) {
        k1 = cc;
        callcc(function(cc) {
            k2 = cc;
            return 5;
        }, null, function($0error0$, $0value0$) {
            if ($0error0$) return cc($0error0$); else {
                return cc(null, $0value0$);
            }
        })
    }, null, function($0error0$, $0value0$) {
        if ($0error0$) return cc($0error0$); else callcc(function(cc) {
            k3 = cc;
            return 5;
        }, null, function($0error1$, $0value1$) {
            if ($0error0$) return cc($0error0$); else {
                a = $0value0$ + $0value1$
                console.log(new Error().stack);
                print("a = " + a);
                callcc(function(cc) {
                    var f;
                    f = 6
                    cc(null, f);
                }, null, function($1error0$, $1value0$) {
                    if ($1error0$) return cc($1error0$); else {
                        b = $1value0$
                        print("b = " + b);
                        callcc(function(cc) {
                            k4 = k = cc;
                            return 0;
                        }, null, function($2error0$, $2value0$) {
                            if ($2error0$) return cc($2error0$); else {
                                x = $2value0$
                                print("x = " + x);
                                if (x < 5) k(null, x + 1);
                            }
                        })
                    }
                })
            }
        })
    })
};
tt();
setTimeout(function() {
	k1(6);
	k2(2);
	k3(4);
	k4(3);
}, 3000);
