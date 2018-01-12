
var $push = Array.prototype.push;

var repeat = (x, n) => {
	var a = [];
	for (var i = 0; i < n; i++) {
		a.push(x);
	}
	return a;
};

var round = (a) => {
	var p = 0, b = 0, c = 0;
	var w = a.wine, changed = false;
	var r = a.reduce(function(m, e) {
		if (e == "Paper") {
			if (++p == 2) {
				m.push("Wine");
				p = 0;
				changed = true;
			}
		} else if (e == "Wine") {
			++w;
			m.push("Bottle", "Cap");
			changed = true;
		} else if (e == "Bottle") {
			if (++b == 2) {
				m.push("Wine");
				b = 0;
				changed = true;
			}
		} else if (e == "Cap") {
			if (++c == 4) {
				m.push("Wine");
				c = 0;
				changed = true;
			}
		}
		return m;
	}, []);
	if (p) $push.apply(r, repeat("Paper", p));
	if (b) $push.apply(r, repeat("Bottle", b));
	if (c) $push.apply(r, repeat("Cap", c));
	r.wine = w;
	r.changed = changed;
	return r;
};

var display = (i, pool) => console.log(i + ") " + String(pool));

var play = (n) => {
	var i = 0; pool = repeat("Paper", n);
	pool.wine = 0;
	display(i, pool);
	var old = -1;
	while (old != pool.wine || pool.changed) {
		old = pool.wine;
		pool = round(pool);
		display(++i, pool);
	}
	console.log("* You drank " + pool.wine + " bottle(s) of wine");
};

play(10);

// [p, w, b, c]
var paper = (a) => { var p = a[0]; a[0] = p & 1; a[1] += p >> 1; };
var wine = (a) => { var w = a[1]; a[1] = 0; a[2] += w; a[3] += w; a[4] += w; };
var bottle = (a) => { var b = a[2]; a[1] += b >> 1; a[2] = b & 1; };
var cap = (a) => { var c = a[3]; a[1] += c >> 2; a[3] = c & 3; };

var round2 = (a) => { paper(a); wine(a); bottle(a); cap(a); };
var check = (a, x) => a[0] == x[0] && a[1] == x[1] && a[2] == x[2] && a[3] == x[3] && a[4] == x[4];

var play2= (a) => {
	var flag = true;
	var i = 0;
	var x = [-1, -1, -1, -1, -1]
	while (!check(a, x) && i < 50) {
		x = a.slice();
		round2(a);
		display(++i, a);
	}
	console.log("* You drank " + a[4] + " bottle(s) of wine");
};

play2([10,0,0,0,0]);