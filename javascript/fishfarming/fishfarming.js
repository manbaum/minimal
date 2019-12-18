
const println = s => console.log(s);
const xprintln = (...ss) => console.log(ss.join(""));
const debug = (...xs) => (xs.forEach(println), xs[xs.length - 1]);

const D = (target, props, writable = false, enumerable = false, configurable = true) => {
    Reflect.ownKeys(props).forEach(name => {
        const value = props[name];
        Object.defineProperty(target, name, { value, writable, enumerable, configurable });
    });
};
const M = (_ => {
    const cache = new Map();
    const get = (m, key, vf) => {
        if (m.has(key)) {
            return m.get(key);
        } else {
            const v = vf();
            m.set(key, v);
            return v;
        }
    };
    return (f, thisArg) => {
        const fcache = get(cache, f, _ => new Map());
        return D(x => get(fcache, x, _ => f.call(thisArg, x)), {
            self: f,
            drop() {
                fcache.clear();
                cache.delete(f);
                return this;
            }
        });
    };
})();
const fix = n => {
    const zeros = n => "0".repeat(n);
    const trunct = s => s.substring(s.length - n);
    return x => {
        const s = String(x);
        return s.length >= n ? s : trunct(zeros + s);
    };
};

const nat = (_ => {
    D((function*(){})().constructor.prototype, {
        take: function*(n) {
            for (let i = 0; i < n; i++) {
                const x = this.next();
                if (x.done) break; else yield x.value;
            }
        },
        skip: function*(n) {
            for (let i = 0; i < n; i++) {
                if (this.next().done) break;
            }
            yield* this;
        },
        filter: function*(cb, thisArg) {
            let i = 0;
            for (let x of this) {
                if (cb.call(thisArg, x, i++, this)) yield x;
            }
        },
        every: function(cb, thisArg) {
            let i = 0;
            for (let x of this) {
                if (!cb.call(thisArg, x, i++, this)) return false;
            }
            return true;
        },
        any: function(cb, thisArg) {
            let i = 0;
            for (let x of this) {
                if (cb.call(thisArg, x, i++, this)) return true;
            }
            return false;
        },
        group: function(cb, o) {
            const result = o || {};
            let i = 0;
            for (let x of this) {
                const g = cb(x, i++, this);
                let a = result[g];
                if (!a) {
                    a = result[g] = [];
                }
                a.push(x);
            }
            return result;
        },
        map: function*(cb, thisArg) {
            let i = 0;
            for (let x of this) {
                yield cb.call(thisArg, x, i++, this);
            }
        },
        forEach(cb, thisArg) {
            let i = 0;
            for (let x of this) {
                cb.call(thisArg, x, i++, this);
            }
        },
        reduce(cb, initVal) {
            if (arguments.length > 1) {
                let result = initVal, i = 0;
                for (let x of this) {
                    // const s = `result = cb(${result}, ${x}, ${i}) = `;
                    result = cb(result, x, i++, this);
                    // debug(s, result);
                }
                return result;
            } else {
                let result = this.next().value, i = 0;
                for (let x of this) {
                    // const s = `result = cb(${result}, ${x}, ${i}) = `;
                    result = cb(result, x, i++, this);
                    // debug(s, result);
                }
                return result;
            }
        },
        toArray(array) {
            const result = array || [];
            for (let x of this) {
                result.push(x);
            }
            return result;
        }
    });
    D(Array.prototype, {
        toGenerator: function*() {
            yield* this;
        }
    });
    return function*(n, reversed, s = 0) {
        for(let i = 0; i < n; i++) {
            yield s + (reversed ? n - i - 1 : i);
        }
    };
})();

const tri = x => (x + 1) * (x + 2) / 2 - 1;
const apr = x => Math.floor(Math.sqrt(2 * x + 2) - 0.5);
const apv = x => { const d = x + 0.5; return Math.floor(d * d) / 2; };

const init = ss => {
	const m = ss.reduce((w, s) => {
        const vi = Reflect.ownKeys(w).length;
        const a = s.split(/\//);
        const vn = a[0];
        const v = a[1].split(/,/).map(t => {
            const u = t.split(/:/);
            const cn = u[0], dn = u[u.length - 1];
            return { cn, dn };
        });
        const s2 = a[2], subject = i => s2.replace(/\$/g, v[i].dn);
        const s3 = a[3], verb = i => s3.replace(/\$/g, v[i].dn);
        w[vn] = { vi, vn, subject, verb, v };
        return w;
    }, {});
	const ns = Reflect.ownKeys(m).reduce((n, k) => {
		const v = m[k];
		n[v.vi] = v.vn;
		return n;
	}, []);
	const nx = ns.length, ny = m[ns[0]].v.length, sz = nx * ny, nz = tri(sz - 1) + 1;
    const b = nat(sz).reduce((m, i) => {
        const t = tri(i);
        return nat(i % ny + 1).reduce((m, j) => (m[t - j] = j ? 2 : 1, m), m);
    }, Array(nz));
	const lookup = ([ i, j ], p) => {
		const mi = m[ns[i]];
		switch (p) {
			case 1: return mi.verb(j);
			case 2: return "不可能" + mi.verb(j);
			case 3: return mi.subject(j);
            case 13: return "已知" + mi.subject(j);
            case 23: return "假设" + mi.subject(j);
            case 33: return "可推出" + mi.subject(j);
			case 4: return mi.v[j].dn;
			default: return "是否会" + mi.verb(j) + "呢？";
		}
	};
	const at = i => {
		const xn = apr(i), yn = i + xn - tri(xn);
        const ix = [ Math.floor(xn / ny), xn % ny ];
        const iy = [ Math.floor(yn / ny), yn % ny ];
		return { i, xn, yn, ix, iy };
	};
    const from = ({ xn, yn }) => apv(xn) + yn;
    const norm = (xo, yo) => xo >= yo ? { xo, yo, xn: xo, yn: yo } : { xo, yo, xn: yo, yn: xo };
    const norm_msg = (o, p, q) => o.xn == o.yn ? lookup(o.ix, 3) : lookup(o.ix, (p > 0 ? q : 0) + 3) + lookup(o.iy, p);
    const revr_msg = (o, p, q) => o.yn == o.xn ? lookup(o.iy, 3) : lookup(o.iy, (p > 0 ? q : 0) + 3) + lookup(o.ix, p);
    const msg = (i, rev, p) => (rev ? revr_msg : norm_msg)(typeof i === "object" ? i : at(i), (p || b[i] || 0) % 10, Math.floor((p || b[i] || 0) / 10) * 10);
    const words = nat(nz).map(at).filter(o => o.ix[0] != o.iy[0])
            .reduce((m, o) => (m[msg(o, false, 1)] = m[msg(o, true, 1)] = o, m), {});
    const suppose = (w, assert) => {
        const o = words[w];
        if (o !== undefined) {
            b[o.i] = assert ? 1 : 21;
            return `Ok, ${msg(o, false, assert ? 11 : 21)}。`;
        } else {
            return `你说啥？${w}？`;
        }
    };
    const collis = o => {
        const { i, xn, yn, ix, iy } = typeof o === "object" ? o : at(o);
        return nat(sz).map(yn => norm(xn, yn)).map(p => Object.assign(p, at(from(p))))
                .filter(p => p.i != i && b[p.i] > 0)
                .group(p => b[p.i] < 10 ? 0 : 1, []);
    };
    const join = a => {
        const ia = typeof a === "object" ? a : at(a);
        return b => {
            const ib = typeof b === "object" ? b : at(b);
        };
    };
    const deduce = (o, p) => {
        const w = typeof o === "object" ? o : at(o), { i, xn, yn, ix, iy } = w;
        const [ cs0, cs1 ] = colls(o);
        cs0.forEach()
    };
	return { nx, ny, sz, nz, at, from, norm, msg, collis, suppose, deduce, b(i) { return b[i]; } };
};

nat(15).map(i=>{const t=tri(i); return nat(i+1,true).map(i=>fix(3)(t-i)).toArray().join(",");}).forEach(println);
nat(15).map(i=>{const t=tri(i); return nat(i%5+1,true).map(i=>fix(3)(t-i)).toArray().join(",");}).forEach(println);

nat(K.sz).map(i=>{const t=tri(i); return nat(i+1,true).map(i=>fix(3)(t-i)).toArray().join(",");}).forEach(println);
nat(K.sz).map(xn => nat(K.sz).map(yn=>K.mk(xn,yn)).map(fix(3)).toArray().join(",")).forEach(println);

K = init([
    `房号/01,02,03,04,05/住$号房子的人/住$号房子`,
    `国家/英:英国,瑞:瑞典,丹:丹麦,挪:挪威,德:德国/$人/是$人`,
    `颜色/红,蓝,绿,黄,白/$色房子主人/住$色房子`,
    `饮料/茶,咖:咖啡,啤:啤酒,奶:牛奶,水/喝$的人/喝$`,
    `香烟/PM:PallMall,DU:Dunhill,BM:BlueMaster,BL:Blends,PR:Prince/抽$香烟的人/抽$香烟`,
    `宠物/狗,猫,鸟,马,鱼/养$的人/养$`
]);
[
    "英国人住红色房子",
    "瑞典人养狗",
    "丹麦人喝茶",
    "绿色房子主人喝咖啡",
    "抽PallMall香烟的人养鸟",
    "黄色房子主人抽Dunhill香烟",
    "抽BlueMaster香烟的人喝啤酒",
    "德国人抽Prince香烟"
].forEach(s => println(K.suppose(s, true)));

nat(15).map(i=>{const t=tri(i); return nat(i+1,true).map(i=>K.b[t-i]||0).toArray().join(",");}).forEach(println);
nat(15).map(i=>{const t=tri(i); return nat(i%5+1,true).map(i=>K.b[t-i]||0).toArray().join(",");}).forEach(println);

nat(15).map(i=>{const t=tri(i); return nat(i%5+1,true).map(i=>K.at(t-i)).map(o=>fix(2)(o.xn)+fix(2)(o.yn)).toArray().join(",");}).forEach(println);

nat(15).map(i=>Object.assign(K.at(i), { from: K.from(K.at(i)) })).toArray();

nat(K.nz).map(K.at).map(o=>(o.from=K.from(o),o)).filter(o=>o.i!=o.from).forEach(println);

var stringTitle = "一,二,三,四,五,英国,瑞典,丹麦,挪威,德国,红,蓝,绿,黄,白,茶,咖啡,啤酒,牛奶,水,PM,D,BM,B,P,狗,猫,鸟,马,鱼";
var arrayTitle = stringTitle.split(",");

var mapTitle = new Object();
var mapCell = new Object();
var arrayCell = new Array();

function createMap() {
    var i, j, o;
    for (i = 0; i < arrayTitle.length; i++) {
        mapTitle[arrayTitle[i]] = i;
        arrayCell[i] = new Array();
    }

    for (i = 0; i < arrayTitle.length; i++) {
        for (j = i; j < arrayTitle.length; j++) {
            o = new Object();
            o.row = i;
            o.column = j;
            o.id = normalizedPair(i, j);
            o.color = 0;
            o.reason = new Object();

            arrayCell[i][j] = o;
            mapCell[formatPair(i, j)] = o;

            if (i != j) {
                arrayCell[j][i] = o;
                mapCell[formatPair(j, i)] = o;
            }
        }
    }

    for (i = 0; i < arrayTitle.length; i++) {
        var k = Math.floor(i / 5) * 5;
        for (j = i; j < k + 5; j++) {
            o = mapCell[formatPair(i, j)];
            o.color = (i == j ? 1 : 2);
            o.reason[formatPair(i, j)] = o.color;
        }
    }
}

function formatNumber(n) {
    var t = "0" + (n + 1);
    return t.substr(t.length - 2, 2);
}

function deformatNumber(v) {
    return parseInt(v) - 1;
}

function formatPair(m, n) {
    return "v" + formatNumber(m) + formatNumber(n);
}

function normalizedPair(m, n) {
    var a = m;
    var b = n;
    if (a > b) {
        a = n;
        b = m;
    }
    return formatPair(a, b);
}

function getRow(p) {
    return deformatNumber(p.substr(1, 2));
}

function getColumn(p) {
    return deformatNumber(p.substr(3, 2));
}

function findDye(p, c, result) {
    var o = mapCell[p];

    var t = new Object();
    findDyeClosure(o.row, o.column, 1, t);
    var s = new Object();
    findDyeClosure(o.row, o.column, 2, s);

    var m, n, v, x;
    for (m in t) {
        for (n in t) {
            if (m < n) {
                v = arrayCell[m][n];
                if (result[v.id] == null) {
                    if (c != 0) {
                        if (v.color == 0) {
                            result[v.id] = p;

                            v.color = c;
                            v.reason[p] = c;

                            if (t[m].row != t[m].column) {
                                v.reason[t[m].id] = t[m].color;
                            }
                            if (t[n].row != t[n].column) {
                                v.reason[t[n].id] = t[n].color;
                            }
                        }
                    } else {
                        if (v.color != 0 && v.reason[p] != null) {
                            result[v.id] = p;

                            v.color = c;
                            v.reason = new Object();
                        }
                    }
                }
            }
        }

        if (c != 2) {
            for (n in s) {
                v = arrayCell[m][n];
                if (result[v.id] == null) {
                    if (c == 1) {
                        if (v.color == 0) {
                            result[v.id] = p;

                            v.color = 2;
                            v.reason[p] = c;

                            if (t[m].row != t[m].column) {
                                v.reason[t[m].id] = t[m].color;
                            }
                            if (s[n].row != s[n].column) {
                                v.reason[s[n].id] = s[n].color;
                            }
                        }
                    } else if (c == 0) {
                        if (v.color == 2 && v.reason[p] != null) {
                            result[v.id] = p;

                            v.color = c;
                            v.reason = new Object();
                        }
                    }
                }
            }
        }
    }
}

function findDyeClosure(m, n, c, result) {
    var i;
    var cnt = 0;
    for (i = 0; i < arrayTitle.length; i++) {
        if (arrayCell[m][i].color == c && result[i] == null) {
            result[i] = arrayCell[m][i];
            cnt++;
        }
        if (arrayCell[i][n].color == c && result[i] == null) {
            result[i] = arrayCell[i][n];
            cnt++;
        }
    }
    return cnt;
}

createMap();