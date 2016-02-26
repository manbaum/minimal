
"use strict"

const u2 = require("uglify-js");

let u2ast = exports;
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
u2ast.compress = function(ast) {
	return ast.transform(u2ast.compressor);
};
u2ast.mangle = function(func) {
	let ast = u2.parse("(" + func.print_to_string() + ")");
	ast.figure_out_scope();
	ast.compute_char_frequency();
	ast.mangle_names();
	return ast.body[0].body;
}
u2ast.minify = function(func, no_compress) {
	let ast = u2ast.mangle(func);
	if (!no_compress) ast = u2ast.compress(ast);
	return ast;
};
