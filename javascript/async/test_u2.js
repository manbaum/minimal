
var U2 = require("uglify-js");

function replace_throw_string(code) {
    var ast = U2.parse(code);
    // accumulate `throw "string"` nodes in this array
    var throw_string_nodes = [];
    ast.walk(new U2.TreeWalker(function(node){
        if (node instanceof U2.AST_Throw
            && node.value instanceof U2.AST_String) {
            throw_string_nodes.push(node);
        }
    }));
    // now go through the nodes backwards and replace code
    for (var i = throw_string_nodes.length; --i >= 0;) {
        var node = throw_string_nodes[i];
        var start_pos = node.start.pos;
        var end_pos = node.end.endpos;
        var replacement = new U2.AST_Throw({
            value: new U2.AST_New({
                expression: new U2.AST_SymbolRef({ name: "Error" }),
                args: [ node.value ]
            })
        }).print_to_string({ beautify: true });
        code = splice_string(code, start_pos, end_pos, replacement);
    }
    return code;
}

function splice_string(str, begin, end, replacement) {
    return str.substr(0, begin) + replacement + str.substr(end);
}

// test it

function test() {
    if (foo) throw bar;
    if (moo /* foo */) {
      throw "foo";
    }
    throw "bar";
}

console.log(replace_throw_string(test.toString()));