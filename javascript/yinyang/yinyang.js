var defer = function(f, context) {
    return function() {
        var args = arguments;
        return process.nextTick(function() {
            f.apply(context, args);
        });
    };
};

var callcc = function(lambda, cps) {
    lambda(defer(cps), cps);
};

// (let* ((yin
//         ((lambda (cc) (display #\@) cc)
//          (call-with-current-continuation (lambda (c) c))))
//        (yang
//         ((lambda (cc) (display #\*) cc)
//          (call-with-current-continuation (lambda (c) c)))))
//   (yin yang))

var yinyang = function() {
	var yin, yang;
    // yin's call-with-current-continuation
    callcc(
        // (lambda (c) c)
        function(c, cps) {
            cps(c);
        },
        // yin's countinuation
        function(value) {
            // (let ((yin) ((lambda (cc) (display #\@) cc) (yin's continuation))))
            yin = (function(cc) {
                process.stdout.write("@");
                return cc;
            })(value);
            // yang's call-with-current-continuation
            callcc(
                // (lambda (c) c)
                function(c, cps) {
                    cps(c);
                },
                // yang's continuation
                function(value) {
                    // (let ((yang) ((lambda (cc) (display #\*) cc) (yang's continuation))))
                    yang = (function(cc) {
                        process.stdout.write("*");
                        return cc;
                    })(value);
                    // (yin yang)
                    yin(yang);
                }
            );
        }
    );
};

yinyang();