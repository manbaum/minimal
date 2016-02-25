
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
const make_name = (a, b) => a + unique_id() + b;
const name_gen = (a, b) => endless_gen(make_name).bind(null, a || "", b || "");

const u2ast = {};
u2ast.debugger = new u2.AST_Debugger();
u2ast.directive = (value) => new u2.AST_Directive({ value:value });
u2ast.simple = (body) => new u2.AST_SimpleStatement({ body: body });
u2ast.block = (body) => new u2.AST_BlockStatement({ body: body });
u2ast.top = (body) => new u2.AST_Toplevel({ body: body });
u2ast.accessor = (name, argnames, body) => new u2.AST_Accessor({ name: name, argnames: argnames, body: body });
u2ast.function = (name, argnames, body) => new u2.AST_Function({ name: name, argnames: argnames, body: body });
u2ast.defun = (name, argnames, body) => new u2.AST_Defun({ name: name, argnames: argnames, body: body });
u2ast.switch = (expr, body) => new u2.AST_Switch({ expression: expr, body: body });
u2ast.default = (body) => new u2.AST_Default({ body: body });
u2ast.case = (expr, body) => new u2.AST_Case({ expression: expr, body: body });
u2ast.try = (btry, bcatch, bfinally) => new u2.AST_Try({ body: btry, bcatch: bcatch, bfinally: bfinally });
u2ast.catch = (argname, body) => new u2.AST_Catch({ argname: argname, body: body });
u2ast.finally = (body) => new u2.AST_Finally({ body: body });
u2ast.empty = new u2.AST_EmptyStatement();
u2ast.label = (label, body) => new u2.AST_LabeledStatement({ label: label, body: body });
u2ast.do = (cond, body) => new u2.AST_Do({ condition: cond, body: body });
u2ast.while = (cond, body) => new u2.AST_While({ condition: cond, body: body });
u2ast.for = (init, cond, step, body) => u2.AST_For({ init: init, condition: cond, step: step, body: body });
u2ast.forin = (init, name, object, body) => u2.AST_ForIn({ init: init, name: name, object: object, body: body });
u2ast.with = (expr, body) => u2.AST_With({ expression: expr, body: body });
u2ast.if = (cond, bthen, belse) => new u2.AST_If({ condition: cond, body: bthen, alternative: belse });
u2ast.return = (value) => new u2.AST_Return({ value: value });
u2ast.throw = (value) => new u2.AST_Throw({ value: value });
u2ast.break = (label) => new u2.AST_Break({ label: label });
u2ast.continue = (label) => new u2.AST_Continue({ label: label });
u2ast.var = (def) => new u2.AST_Var({ definitions: def });
u2ast.const = (def) => new u2.AST_Const({ definitions: def });
u2ast.vardef = (name, value) => new u2.AST_VarDef({ name: name, value: value });
u2ast.call = (expr, args) => new u2.AST_Call({ expression: expr, args: args });
u2ast.new = (expr, args) => new u2.AST_New({ expression: expr, args: args });
u2ast.comma = (car, cdr) => new u2.AST_Seq({ car: car, cdr: cdr });
u2ast.dot = (expr, prop) => new u2.AST_Dot({ expression: expr, property: prop });
u2ast.indexer = (expr, prop) => new u2.AST_Sub({ expression: expr, property: prop });
u2ast.uprefix = (op, expr) => new u2.AST_UnaryPrefix({ operator: op, expression: expr });
u2ast.upostfix = (op, expr) => new u2.AST_UnaryPostfix({ operator: op, expression: expr });
u2ast.binary = (left, op, right) => new u2.AST_Binary({ left: left, operator: op, right: right });
u2ast.assign = (left, right) => new u2.AST_Assign({ left: left, operator: "=", right: right });
u2ast.cond = (cond, ethen, eelse) => new u2.AST_Conditional({ condition: cond, consequent: ethen, alternative: eelse });
u2ast.array = (elem) => new u2.AST_Array({ elements: elem });
u2ast.object = (prop) => new u2.AST_Object({properties: prop });
u2ast.objkeyval = (key, value) => new u2.AST_ObjectKeyVal({ key: key, value: value });
u2ast.objsetter = (key, value) => new u2.AST_ObjectSetter({ key: key, value: value });
u2ast.objgetter = (key, value) => new u2.AST_ObjectGetter({ key: key, value: value });
u2ast.symaccessor = (name) => new u2.AST_SymbolAccessor({ name: name });
u2ast.symvar = (name) => new u2.AST_SymbolVar({ name: name });
u2ast.symfarg = (name) => new u2.AST_SymbolFunarg({ name: name });
u2ast.symconst = (name) => new u2.AST_SymbolConst({ name: name });
u2ast.symdefun = (name) => new u2.AST_SymbolDefun({ name: name });
u2ast.symlambda = (name) => new u2.AST_SymbolLambda({ name: name });
u2ast.symcatch = (name) => new u2.AST_SymbolCatch({ name: name });
u2ast.symlabel = (name) => new u2.AST_Label({ name: name });
u2ast.symref = (name) => new u2.AST_SymbolRef({ name: name });
u2ast.symref = (name) => new u2.AST_SymbolRef({ name: name });
u2ast.labelref = (name) => new u2.AST_LabelRef({ name: name });
u2ast.this = new u2.AST_This({ name: "this" });
u2ast.string = (s) => new u2.AST_String({ value: s });
u2ast.number = (n) => new u2.AST_Number({ value: n });
u2ast.regexp = (r) => new u2.AST_RegExp({ value: r });
u2ast.null = new u2.AST_Null();
u2ast.nan = new u2.AST_NaN();
u2ast.undefined = new u2.AST_Undefined();
u2ast.inf = new u2.AST_Infinity();
u2ast.true = new u2.AST_True();
u2ast.false = new u2.AST_False();

u2ast.walker = function(visitor) {
	let level = 0;
	let walker = new u2.TreeWalker(function(node, descend) {
		if (node instanceof u2.AST_Scope) {
			let ret = visitor(node, level, descend, walker);
			++level;
			if (!ret) descend();
			--level;
			return true;
		} else {
			return visitor(node, level, descend, walker);
		}
	});
	return function(ast) {
		return ast.walk(walker);
	};
};
u2ast.transformer = function(before, after) {
	let level = 0;
	let transformer = new u2.TreeTransformer(function(node, descend) {
		if (node instanceof u2.AST_Scope) {
			let ret = before ? before(node, level, descend, transformer) : undefined;
			if (ret === undefined) ++level;
			return ret;
		} else if (before) {
			return before(node, level, descend, transformer);
		}
	}, function(node) {
		if (node instanceof u2.AST_Scope) {
			--level;
			let ret = after ? after(node, level, transformer) : undefined;
			return ret;
		} else if (after) {
			return after(node, level, transformer);
		}
	});
	return function(ast) {
		return ast.transform(transformer);
	};
};
u2ast.deepclone = (ast) => ast.transform(new u2.TreeTransformer(null, function(){}));
u2ast.compressor = u2.Compressor({ side_effects: false });
u2ast.minify = function(ast, no_compress) {
	ast = u2.parse("(" + ast.print_to_string() + ")");
	ast.figure_out_scope();
	ast.compute_char_frequency();
	ast.mangle_names();
	if (!no_compress) ast = ast.transform(u2ast.compressor);
	return ast.body[0].body;
};

const underline_name = () => make_name("_", "");
const cps_name = () => make_name("cps_", "");
const error_name = () => make_name("err_", "");
const value_name = () => make_name("val_", "");

const u2_cpsify = function(func) {
	let sym_cps = u2ast.symvar(cps_name());
	let name = func.name ? cps_name() + "$" + func.name : null;
	let argnames = func.argnames ? [...func.argnames, sym_cps] : [sym_cps];
	let new_body = u2_rewrite_callcc(sym_cps, func.body);
	let func_ret = u2ast.function(name, argnames, new_body);
	return u2ast.transformer(null, function(node, level, transformer) {
		let parent = transformer.parent();
		if (node.body && Array.isArray(node.body) && node.body.length) {
			console.log(`-- parent: ${node.CTOR.TYPE} [...${node.body[node.body.length - 1].CTOR.TYPE}] -> ${parent ? parent.CTOR.TYPE : "null"}`);
			u2_simplify_body(node, node.body);
			return node;
		}
	})(func_ret);
};
const u2_rewrite_callcc = function(sym_cps, body) {
	let sym_error = u2ast.symvar(error_name());
	let sym_value = u2ast.symvar(value_name());
	let sym_ex = u2ast.symvar(error_name());

	let new_body = [];
	let collect_callcc = new Map();
	for (let i = 0; i < body.length; i++) {
		let st = body[i];
		u2ast.walker(function(node, level, walker) {
			if (node instanceof u2.AST_Lambda) {
				return true;
			} else if (node instanceof u2.AST_Call) {
				if (node.expression instanceof u2.AST_SymbolRef && node.expression.name == "callcc") {
					collect_callcc.set(node, {
						sym_err: u2ast.symvar(error_name()),
						sym_val: u2ast.symvar(value_name())
					});
				}
			}
		})(st);
		if (collect_callcc.size) {
			let rest = body.slice(i + 1);
			new_body.push(u2_create_continuation(sym_cps, st, collect_callcc, rest));
			return new_body;
		}
	}
	let btry = new_body.map(u2ast.transformer(function(node, level) {
		if (node instanceof u2.AST_Function) {
			return node;
		} else if (node instanceof u2.AST_Call) {
			if (node.expression instanceof u2.AST_SymbolRef && node.expression.name == "callcc") {
				let lambda = node.args[0];
				if (lambda instanceof u2.AST_Function) {
					return u2ast.call(node.expression, [u2_cpsify(lambda)]);
				}
			}
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
		let context = node.args[1] || u2ast.null;
		if (!ret_st) {
			let str = u2ast.simple(u2ast.string(
				`'returns' and 'throws' below should be replaced with call to ${sym_cps.name}`));
			cps = u2ast.function(null, argnames, [str, new_st, ...rest]);
			ret_st = u2ast.call(node.expression, [lambda, context, cps]);
			last = cps;
			sym_cps = lambda.argnames[0];
		} else {
			let str = u2ast.simple(u2ast.string(
				`'returns' and 'throws' below should be replaced with call to ${sym_cps.name}`));
			cps = u2ast.function(null, argnames, last.body);
			last.body = [str, u2ast.call(node.expression, [lambda, context, cps])];
			sym_cps = lambda.argnames[0];
		}
		console.log("-".repeat(20));
		print_ast(ret_st);
	});
	return ret_st;
}
const u2_simplify_body = function(node, body, eliminate_trailing_return) {
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
		return callcc(function(cc) {
			k2 = cc;
			return 5;
		});
	}) + callcc(function(cc) {
		k3 = cc;
		if (u()) {
			return g(6, cc);
		}
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

var code = "(" + test3.toString() + ")";
var ast = u2.parse(code);
// console.log(ast);
var f = ast.body[0].body;
var new_ast = u2_cpsify(f);
// console.log(new_ast);
print_ast(new_ast);
var min_ast = u2ast.minify(new_ast, true);
print_ast(min_ast);

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

function makePredicate(words) {
    if (!(words instanceof Array)) words = words.split(" ");
    var f = "", cats = [];
    out: for (var i = 0; i < words.length; ++i) {
        for (var j = 0; j < cats.length; ++j)
            if (cats[j][0].length == words[i].length) {
                cats[j].push(words[i]);
                continue out;
            }
        cats.push([words[i]]);
    }
    function compareTo(arr) {
        if (arr.length == 1) return f += "return str === " + JSON.stringify(arr[0]) + ";";
        f += "switch(str){";
        for (var i = 0; i < arr.length; ++i) f += "case " + JSON.stringify(arr[i]) + ":";
        f += "return true}return false;";
    }
    // When there are more than three length categories, an outer
    // switch first dispatches on the lengths, to save on comparisons.
    if (cats.length > 3) {
        cats.sort(function(a, b) {return b.length - a.length;});
        f += "switch(str.length){";
        for (var i = 0; i < cats.length; ++i) {
            var cat = cats[i];
            f += "case " + cat[0].length + ":";
            compareTo(cat);
        }
        f += "}";
        // Otherwise, simply generate a flat `switch` statement.
    } else {
        compareTo(words);
    }
    return new Function("str", f);
};

var KEYWORDS = 'abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized this throws transient volatile yield';

// var p = makePredicate(KEYWORDS);
// code = "(" + p.toString() + ")";
// ast = u2.parse(code);
// print_ast(ast);
