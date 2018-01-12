
var DEBUG = false;

var Arrays = {
	'fill': function(array, value, count, startIndex) {
		count = count || array.length;
		startIndex = startIndex || 0;
		for (var i = startIndex; i < count; i++) {
			array[i] = value;
		}
		return array;
	},
	'remove': function(array, startIndex, count) {
		array.splice(startIndex, count || 1);
		return array;
	},
	'insert': function(array, index) {
		if (arguments.length > 2) {
			var prepare = [0, index];
			for (var i = 2; i < arguments.length; i++) {
				var arg = arguments[i];
				if (arg.constructor === Array) {
					arg.forEach(function(e) { prepare.push(e); });
				} else {
					prepare.push(arg);
				}
			}
			Array.prototype.splice.apply(array, prepare);
		}
		return array;
	},
	'append': function(array) {
		for (var i = 1; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg.constructor === Array) {
				arg.forEach(function(e) { array.push(e); });
			} else {
				array.push(arg);
			}
		}
		return array;
	},
	'collect': function(array, callback, thisArg) {
		var result = [];
		array.forEach(function(e, i) {
			Arrays.append(result, callback.call(thisArg, e, i, array));
		});
		return result;
	}
}

var Cache = function(name, tell) {
	// name and tell are for debugging purpose.
	if (DEBUG) {
		name = name || "";
		tell = tell || function(x) { return x; };
	}

	var map = {};
	this.put = function(i, j, value) {
		if (DEBUG) {
			console.info("--- cache-" + name + ": p(" + i + "," + j + ") = " + tell(value));
		}
		var o = map[i];
		if (!o) o = map[i] = {};
		return o[j] = value;
	}
	this.get = function(i, j) {
		var o = map[i];
		return o != null ? o[j] : null;
	}
}

var Holder = function(n) {
	var partitions = [];
	var stats = Arrays.fill([], 0, n);
	this.get = function() {
		return { 'partitions': partitions, 'stats': stats  };
	}
	this.push = function(partition, printPartition) {
		partitions.push(partition);
		if (partition.length > 0) ++stats[n - partition[0]];
		else console.log(`......... ah!!!`);
		// if (printPartition) printPartition(n, partitions.length, partition);
		return this;
	}
	this.merge = function(holder, printPartition) {
		for (var i = 0; i < holder.partitions.length; i++) {
			this.push(holder.partitions[i], printPartition);
		}
		return this;
	}
	this.combine = function(part, holder, printPartition) {
		for (var i = 0; i < holder.partitions.length; i++) {
			this.push(part.concat(holder.partitions[i]), printPartition);
		}
		return this;
	}
}

Holder.cacheTell = function(holder) {
	return holder.partitions.length;
}

Holder.printPartitions = function(holder, n, printPartition) {
	if (printPartition) {
		for (var i = 0; i < holder.partitions.length; i++) {
			printPartition(n, i + 1, holder.partitions[i]);
		}
	}
	return holder;
}


var partition1 = (function() {
	var cache = new Cache("1", Holder.cacheTell);
	var p = function(n, printPartition) {
		var holder = new Holder(n);
		var rest = n;
		var working = []; // working partition array
		var i = 0;        // current working index
		var mrf = -1;     // the most recently filled number
		// fill number loop
		while (true) {
			if (DEBUG) {
				console.info("--- " + n + " " + rest + " [" + working.join(",") + "] " + i + " " + mrf);
			}
			if (i > n) {
				console.info("*** something wrong!");
				return;
			}
			if (rest == 0) {
				holder.push(working, printPartition);
				if (i == n) return holder.get();
				// backtrack loop
				while (true) {
					--working[--i];
					++rest;
					if (working[i] == 0) {
						Arrays.remove(working, i);
					} else {
						// a possible solution found, break.
						mrf = working[i++];
						break;
					}
				}
			} else {
				// i == 0     when filling in the first number, it's unconditionally ok.
				// rest < mrf ensures a descending order to avoid repetitions,
				//            i.e. during fill number loopping, partition sequence 3-2-1-1
				//            can appear as 2-1-3-1 and 1-2-1-3 and 1-1-3-2 and so forth,
				//            forcing a descending order will make it always be 3-2-1-1 identically.
				var value = (i == 0 || rest < mrf) ? rest : mrf;
				mrf = working[i++] = value;
				rest -= value;
			}
		}
		return holder.get();
	}
	return function(n, printPartition) {
		var cached = cache.get(n, n);
		if (cached) {
			return Holder.printPartitions(cached, n, printPartition);
		} else {
			return cache.put(n, n, p(n, printPartition));
		}
	}
})();

var partition2 = (function() {
	var cache = new Cache("2", Holder.cacheTell);
	var p2 = function(n, m) {
		if (n <= m) {
			return p(n);
		} else {
			var cached = cache.get(n, m);
			if (cached) {
				return cached;
			} else {
				var holder = new Holder(n);
				var subpar = p(n);
				var count = 0;
				for (var i = subpar.stats.length - m; i < subpar.stats.length; i++) {
					count += subpar.stats[i];
				} 
				for (var i = subpar.partitions.length - count; i < subpar.partitions.length; i++) {
					holder.push(subpar.partitions[i]);
				}
				return cache.put(n, m, holder.get());
			}
		}
	}
	var p = function(n, printPartition) {
		var cached = cache.get(n, n);
		if (cached) {
			return Holder.printPartitions(cached, n, printPartition);
		} else {
			var holder = new Holder(n);
			if (n == 0) {
				holder.push([]);
			} else {
				for (var i = n; i > 0; i--) {
					holder.combine([i], p2(n - i, i), printPartition);
				}
			}
			return cache.put(n, n, holder.get());
		}
	}
	return p;
})();

var partition3 = (function() {
	var cache = new Cache("3", Holder.cacheTell);
	return function(n, printPartition) {
		var cached = cache.get(n, n);
		if (cached) {
			return Holder.printPartitions(cached, n, printPartition);
		} else {
			var count = 0;
			var s = fill([], n, 0);
			var r = [];
			var w = [];
			for (var i = 0; i < n; i++) {
				var v = w[0] = n - i;
				if (i == 0) {
					++count;
					++s[n - v];
					r.push(w.slice(0));
					if (print) print(n, w, count);
				} else {
					var u = p(i);
					var nv = 0;
					for (var j = u.s.length - i; j < u.s.length; j++) nv += u.s[j];
					for (var j = u.count - nv; j < u.count; j++) {
						++count;
						++s[n - v];
						var ww = w.slice(0);
						if (u.r[j]) {
							Array.prototype.splice.apply(ww, [1, 0].concat(u.r[j]));
						}
						r.push(ww);
						if (print) print(n, ww, count);
					}
				}
			}
			return cache.put(n, n, { count: count, s: s, r: r });
		}
	}
})();

// p(n, m) = p(n - m, m) + p(n, m - 1)
//         = p(n + m, m) - p(n + m, m - 1)
//         = p(n, m + 1) - p(n - m - 1, m + 1)
// p(n, m) = p(n, n) = p(n) = p(0, n) + p(n, n - 1) where n <= m
// p(0, m) = 1 where 0 <= m
// p(1, m) = 1 where 1 <= m
// p(n, 1) = 1 where 0 <= n
// p(n, 0) = 0 where n != 0
// p(n, m) = 0 where n <= m < 0
// p(n - t, t) = 0 where 0 <= n < t or t <= 0 <= n

// p(n) = p(n, m) = 0 where n <= m < 0
// p(0) = p(0, m) = 1 where (m >= 0)
// p(n) = p(n, m) = p(0, n) + p(1, n-1) + p(2, n-2) + ... + p(n-1, 1) where (m >= n > 0)
// p(n, 1) = 1 where n > 0
// p(-n, m) = 0 where (n > 0)
// p(n, -m) = 0 where (n > 0, m > 0)
// p(n, 0) = 0 where (n > 0)
// p(n, 1) = 1 where (n > 0)
// p(n, m) = p(n, n) where (m > n >= 0)
var partitionCount = (function() {
	var cache = new Cache();
	var p = function(n, m) {
		if (m == null || m > n) m = n;
		if (n < 0 || n > 0 && m < 1) return 0
		else if (n <= 1 || m == 1) return 1;
		else if (n == 2) return 2;
		else if (m == 2) return (n + 2) >> 1;
		var v = cache.get(n, m);
		if (v) return v;
		else if (n > m) return cache.put(n, m, p(n - m, m) + p(n, m - 1));
		else {
			var sum = 0;
			for (var i = m; i > 0; i--) {
				sum += p(n - i, i);
			}
			return cache.put(n, m, sum);
		}
	}
	return function(n) {
		return p(n);
	}
})();

var explainPartitionCount = (function() {
	var createValue = function(value) {
		return {
			'expr': value,
			'end': true
		}
	}
	var createTerminator = function(expr, value) {
		return {
			'expr': expr,
			'reduce': function() { return createValue(value); }
		}
	}
	var reduce = function(explainers) {
		var result = [];
		var sum = 0;
		var inSum = false;
		explainers.forEach(function(e) {
			if (e.end) {
				if (!inSum) inSum = true;
				sum += e.expr;
			} else {
				if (inSum) {
					result.push(createValue(sum));
					sum = 0;
					inSum = false;
				}
				Arrays.append(result, e.expand());
			}
		});
		if (inSum) result.push(createValue(sum));
		return result;
	}
	var create = function(expr, explainers) {
		return {
			'expr': expr,
			'expand': function() { return explainers; },
			'reduce': function() {
				var text = explainers.map(function(e) { return e.expr; }).join("+");
				var reduced = reduce(explainers);
				if (reduced.length == 1 && reduced[0].end) {
					return createTerminator(text, reduced[0].expr);
				} else {
					return create(text, reduced);
				}
			}
		}
	}
	var emit = function(n, m) {
		var expr = "p(" + n + (m != n ? "," + m : "") + ")";
		if (n < 0) {
			return create(expr, [createValue(0)]);
		} else if (n <= 1 || m == 1) {
			return create(expr, [createValue(1)]);
		} else {
			var explainers = [];
			for (var i = m; i > 0; i--) {
				explainers.push(explain(n - i, i));
			}
			return create(expr, explainers);
		}
	}
	var explain = function(n, m) {
		if (n < 0) {
			return emit(n, n);
		} else if (n == 0) {
			return emit(0, 0);
		} else {
			if (m == null || m > n) m = n;
			return emit(n, m);
		}
	}
	return explain;
})();

// Main routine entry
(function() {
	var color = function(n, text) {
		return "\x1b[3" + (1 + (n % 6)) + "m" + text + "\x1b[0m";
	}
	var printer = {
		'printPartition': function(n, i, partition) {
			console.info(i + ") " + n + " = " + (partition.length > 0 ? color(partition[0], partition.join("+")) : "0"));
		},
		'printStats': function(n, count, stats) {
			var line = "*** p(" + n + ")";
			var indent = line.replace(/./g, " ");
			var explain = [];
			for (var i = 0; i < n; i++) {
				var rest = n - i;
				explain[i] = "p(" + i + (i > rest ? "," + rest : "") + ")";
			}
			console.info(line + " = " + (explain.length > 0 ? explain.join("+") : "p(0)"));
			console.info(indent + " = " + (stats.length > 0 ? stats.join("+") : "1"));
			console.info(indent + " = " + count);
		}
	}
	var explain = function(n, m) {
		var e = explainPartitionCount(n, m);
		var line = "*** " + e.expr;
		var first = true;
		while (!e.end) {
			e = e.reduce();
			console.info(line + " = " + e.expr);
			if (first) {
				line = line.replace(/./g, " ");
				first = false;
			}
		}
	}
	var doPartition = function(n, countAgain, p) {
		var holder = p(n, verbose ? printer.printPartition : null);
		var count = holder.partitions.length;
		printer.printStats(n, count, holder.stats);
		if (count != countAgain) {
			console.info("*** not same! p(" + n + ") = " + count + " .vs. " + countAgain);
		}
	}
	var tryPartition = function(n) {
		var count = partitionCount(n);
		if (skip) {
			console.info("*** p(" + n + ") = " + count);
		} else {
			doPartition(n, count, partition1);
			// doPartition(n, count, partition2);
		}
		// explain(n, n);
	}
	var verbose = false;
	var skip = false;
	var to = false;
	var argStartIndex = 2;
	while (true) {
		var arg = process.argv[argStartIndex];
		if (arg == "-v") {
			verbose = true;
			++argStartIndex;
		} else if (arg == "-k") {
			skip = true;
			++argStartIndex;
		} else if (arg == "-t") {
			to = true;
			++argStartIndex;
		} else {
			break;
		}
	}
	process.argv.slice(argStartIndex).forEach(function(arg) {
		var n = parseInt(arg);
		if (to) {
			for (var i = 1; i <= n; i++) {
				tryPartition(i);
			}
		} else {
			tryPartition(n);
		}
	});
})();
