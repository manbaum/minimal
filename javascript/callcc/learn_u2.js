
"use strict"

const u2 = require("uglify-js");
const u = require("./util");
const u2ast = require("./u2ast");

const underline_name = () => u.make_name("_", "");
const cps_name = () => u.make_name("cps_", "");
const error_name = () => u.make_name("err_", "");
const value_name = () => u.make_name("val_", "");

const u2_cpsify = function(func) {
	let sym_cps = u2ast.symvar(cps_name());
	let new_argnames = func.argnames ? [...func.argnames, sym_cps] : [sym_cps];
	let new_body = u2_rewrite_callcc(sym_cps, func.body);
	let new_func = u2ast.function(func.name, new_argnames, new_body);
	return u2ast.transformer(null, function(node, level, transformer) {
		let parent = transformer.parent();
		if (node.body && Array.isArray(node.body) && node.body.length) {
			// console.log(`-- parent: ${node.CTOR.TYPE} [...${node.body[node.body.length - 1].CTOR.TYPE}] -> ${parent ? parent.CTOR.TYPE : "null"}`);
			u2_simplify_body(node, node.body);
			return node;
		}
	})(new_func);
};
const u2_rewrite_callcc = function(sym_cps, body) {
	let new_body = [];
	let collect_callcc = new Map();
	for (let i = 0; i < body.length; i++) {
		let st = body[i];
		// collect all callccs.
		u2ast.walker(function(node, level, descend, walker) {
			if (node instanceof u2.AST_Call) {
				if (node.expression instanceof u2.AST_SymbolRef && node.expression.name == "callcc") {
					// write done the callcc call.
					collect_callcc.set(node, {
						sym_err: u2ast.symvar(error_name()),
						sym_val: u2ast.symvar(value_name())
					});
				}
			} else if (node instanceof u2.AST_Lambda) {
				// does NOT descend into inner functions.
				return true;
			}
		})(st);
		// if any callcc call found.
		if (collect_callcc.size) {
			// create continuation.
			let rest = u2_rewrite_callcc(sym_cps, body.slice(i + 1));
			new_body.push(u2_create_continuation(sym_cps, st, collect_callcc, rest));
			// rest statements should be in the continuation, break!
			break;
		} else {
			// no callcc call found, write done the statement.
			new_body.push(st);
		}
	}
	return u2_rewrite_return_and_throw(sym_cps, new_body);
};
const u2_create_continuation = function(sym_cps, st, collect_callcc, rest) {
	let new_st = u2ast.transformer(function(node) {
		if (node instanceof u2.AST_Lambda) {
			return node;
		} else if (node instanceof u2.AST_Call) {
			if (node.expression instanceof u2.AST_SymbolRef && node.expression.name == "callcc") {
				return collect_callcc.get(node).sym_val;
			}
		}
	})(st);
	let ret_st, cps, last;
	collect_callcc.forEach(function(v, node) {
		let argnames = [v.sym_err, v.sym_val];
		let lambda = node.args[0];
		if (lambda instanceof u2.AST_Function) {
			let lambda_body = u2_rewrite_callcc(lambda.argnames[0], lambda.body);
			lambda = u2ast.function(lambda.name, lambda.argnames, lambda_body);
		}
		let context = node.args[1] || u2ast.null;
		if (!ret_st) {
			let cps_body = u2_rewrite_return_and_throw(sym_cps, [new_st, ...rest]);
			cps = u2ast.function(null, argnames, cps_body);
			ret_st = u2ast.call(node.expression, [lambda, context, cps]);
		} else {
			cps = u2ast.function(null, argnames, last.body);
			last.body = [u2ast.call(node.expression, [lambda, context, cps])];
		}
		last = cps;
		sym_cps = lambda.argnames[0];
	});
	return ret_st;
};
const u2_rewrite_return_and_throw = function(sym_cps, body) {
	let sym_error = u2ast.symvar(error_name());
	let sym_value = u2ast.symvar(value_name());
	let sym_ex = u2ast.symvar(error_name());
	let btry = body.map(u2ast.transformer(function(node, level) {
		if (node instanceof u2.AST_Function) {
			return node;
		}
	}, function(node, level) {
		if (node instanceof u2.AST_Return) {
			let e = u2ast.simple(u2ast.assign(sym_error, u2ast.null));
			let v = u2ast.simple(u2ast.assign(sym_value, node.value));
			return u2ast.block([e, v, u2ast.return()]);
		} else if (node instanceof u2.AST_Throw) {
			let e = u2ast.simple(u2ast.assign(sym_error, node.value));
			return u2ast.block([e, u2ast.return()]);
		}
	}));
	let st_var = u2ast.var([sym_error, sym_value]);
	let bcatch = [u2ast.simple(u2ast.assign(sym_error, sym_ex))];
	let call_err = u2ast.simple(u2ast.call(sym_cps, [sym_error]));
	let call_val = u2ast.simple(u2ast.call(sym_cps, [u2ast.null, sym_value]));
	let bfinally = [u2ast.if(sym_error, call_err, call_val)];
	let st_try = u2ast.try(btry, u2ast.catch(sym_ex, bcatch), u2ast.finally(bfinally));
	return [st_var, st_try];
};
const u2_simplify_body = function(body, eliminate_trailing_return) {
	let n = body.length;
	if (n > 0 && body[n - 1] instanceof u2.AST_BlockStatement) {
		body.splice(n - 1, 1, ...body[n - 1].body);
		console.log(` - simplified`);
	}
	if (eliminate_trailing_return) {
		n = body.length;
		if (body[n - 1] instanceof u2.AST_Return && body[n - 1].value == null) {
			body.splice(n - 1, 1);
		}
	}
};


var print_ast = function(ast, raw) {
	console.log(ast.print_to_string({ beautify: !raw }));
};

var test1= function(a) {
	return function() {
		if (a > 0) return a;
		else throw new Error("should be greater than 0");
	};
};
var test2 = function(a) {
	return a + uncps(f)(a) + uncps(function(a, cps) {
		cps(a + 5);
	})(a);
};
var test3 = function() {
	var a = callcc(function(cc) {
		k1 = cc;
		cc(5 + callcc(function(cc) {
			k2 = cc;
			cc(5);
		}));
	}) + callcc(function(cc) {
		k3 = cc;
		if (u()) {
			cc(g(6, cc));
		}
		cc(5);
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
		cc(0);
	});
	print("x = " + x);
	var y = callcc(function(cc) {
		(function(callback) {
			callback(5);
			throw new Error("gaga!");
		})(function(value) {
			cc(value);
		});
	});
	console.log(y);
	if (x < 5) k(null, x + 1);
};

// var code = "(" + test3.toString() + ")";
// var ast = u2.parse(code);
// // console.log(ast);
// var f = ast.body[0].body;
// var new_ast = u2_cpsify(f);
// // console.log(new_ast);
// print_ast(new_ast);
// var min_ast = u2ast.minify(new_ast, false);
// print_ast(min_ast);

// console.log("-".repeat(20));
// ast = u2.parse("(function(a){return a(function(){ return 3; });})");
// print_ast(ast);
// console.log("-".repeat(20));
// u2ast.walker(function(node, level) {
// 	var indent = "  ".repeat(level);
// 	console.log(indent + node.CTOR.TYPE);
// })(ast);
// console.log("-".repeat(20));
// u2ast.transformer(function(node, level) {
// 	var indent = "  ".repeat(level);
// 	console.log(indent + node.CTOR.TYPE);
// })(ast);
// console.log("-".repeat(20));
// u2ast.transformer(null, function(node, level) {
// 	var indent = "  ".repeat(level);
// 	console.log(indent + node.CTOR.TYPE);
// })(ast);

// function makePredicate(words) {
//     if (!(words instanceof Array)) words = words.split(" ");
//     var f = "", cats = [];
//     out: for (var i = 0; i < words.length; ++i) {
//         for (var j = 0; j < cats.length; ++j)
//             if (cats[j][0].length == words[i].length) {
//                 cats[j].push(words[i]);
//                 continue out;
//             }
//         cats.push([words[i]]);
//     }
//     function compareTo(arr) {
//         if (arr.length == 1) return f += "return str === " + JSON.stringify(arr[0]) + ";";
//         f += "switch(str){";
//         for (var i = 0; i < arr.length; ++i) f += "case " + JSON.stringify(arr[i]) + ":";
//         f += "return true}return false;";
//     }
//     // When there are more than three length categories, an outer
//     // switch first dispatches on the lengths, to save on comparisons.
//     if (cats.length > 3) {
//         cats.sort(function(a, b) {return b.length - a.length;});
//         f += "switch(str.length){";
//         for (var i = 0; i < cats.length; ++i) {
//             var cat = cats[i];
//             f += "case " + cat[0].length + ":";
//             compareTo(cat);
//         }
//         f += "}";
//         // Otherwise, simply generate a flat `switch` statement.
//     } else {
//         compareTo(words);
//     }
//     return new Function("str", f);
// };

// var KEYWORDS = 'abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized this throws transient volatile yield';

// var p = makePredicate(KEYWORDS);
// code = "(" + p.toString() + ")";
// ast = u2.parse(code);
// print_ast(ast);

var oddEvenList = function(head) {
    if (head && head.next) {
        var ehead = head.next, po = head, pe = ehead;
        while(1) {
            if (!pe.next) break;
            else po = po.next = pe.next;
            if (!po.next) break;
            else pe = pe.next = po.next;
        }
        po.next = ehead, pe.next = null;
    }
    return head;
};

let code = "(" + oddEvenList.toString() + ")";
console.log(code);
console.log();
try {
	let ast = u2.parse(code);
	let min_ast = u2ast.minify(ast, true);
	print_ast(min_ast);
} catch (e) {
	console.log(e);
	console.log();
	console.log(code.substr(e.col));
}
