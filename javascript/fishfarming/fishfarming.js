"use strict"

const println = s => console.log(s);
const xprintln = (...xs) => console.log(xs.join(""));
const debug = (...xs) => (xs.forEach(println), xs[xs.length - 1]);

const D = (target, writable = false, enumerable = false, configurable = true) => {
    const defineValue = (name, value) => {
        Object.defineProperty(target, name, {
            value,
            writable,
            enumerable,
            configurable
        });
    };
    const defineProp = (name, value) => {
        const {
            get,
            set
        } = typeof value !== "function" ? value : {
            get: value
        };
        if (set != null) {
            Object.defineProperty(target, name, {
                get,
                set,
                enumerable,
                configurable
            });
        } else {
            Object.defineProperty(target, name, {
                get,
                enumerable,
                configurable
            });
        }
    };
    const d = {
        values(props) {
            Reflect.ownKeys(props).forEach(name => defineValue(name, props[name]));
            return d;
        },
        props(props) {
            Reflect.ownKeys(props).forEach(name => defineProp(name, props[name]));
            return d;
        }
    };
    return d;
};

const mapGetOrCreate = (map, key, create) => {
    if (map.has(key)) return map.get(key);
    const v = create();
    map.set(key, v);
    return v;
};
const memorize = f => {
    const map = mapGetOrCreate(memorize.cache, f, () => new Map);
    const mf = (...args) => mapGetOrCreate(map, JSON.stringify(args), () => f(...args));
    D(mf)
        .props({
            apply() {
                return f;
            },
        })
        .values({
            clear() {
                map.clear();
                return this;
            }
        });
    return mf;
};
D(memorize)
    .values({
        cache: new Map
    });

const fix = n => {
    const padding = " ".repeat(n);
    const trunct = s => s.substring(s.length - n);
    return x => {
        const s = String(x);
        return s.length >= n ? s : trunct(padding + s);
    };
};

const nat = function* (n, s = 0, t = 1) {
    let k = s;
    for (let i = 0; i < n; i++) {
        yield k;
        k += t;
    }
};

D(function* () {}().constructor.prototype)
    .values({
        take: function* (n) {
            let i = 0;
            for (let x of this) {
                if (i >= n) break;
                yield x;
                ++i;
            }
        },
        skip: function* (n) {
            let i = 0;
            for (let x of this) {
                if (i >= n) yield x;
                else ++i;
            }
        },
        filter: function* (cb, ctx) {
            let i = 0;
            for (let x of this) {
                if (cb.call(ctx, x, i++, this)) yield x;
            }
        },
        every: function (cb, ctx) {
            let i = 0;
            for (let x of this) {
                if (!cb.call(ctx, x, i++, this)) return false;
            }
            return true;
        },
        some: function (cb, ctx) {
            let i = 0;
            for (let x of this) {
                if (cb.call(ctx, x, i++, this)) return true;
            }
            return false;
        },
        group: function (cb, o) {
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
        map: function* (cb, ctx) {
            let i = 0;
            for (let x of this) {
                yield cb.call(ctx, x, i++, this);
            }
        },
        forEach(cb, ctx) {
            let i = 0;
            for (let x of this) {
                cb.call(ctx, x, i++, this);
            }
        },
        reduce(cb, initVal) {
            if (arguments.length > 1) {
                let result = initVal,
                    i = 0;
                for (let x of this) {
                    result = cb(result, x, i++, this);
                }
                return result;
            } else {
                let empty = true;
                let result = null,
                    i = 0;
                for (let x of this) {
                    if (i == 0) {
                        result = x;
                        ++i;
                        empty = false;
                    } else {
                        result = cb(result, x, i++, this);
                    }
                }
                if (empty) throw new Error("reduce.empty.iterator.without.initial.value");
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

// Seq: 0, 2, 5, 9, 14, 20, 27, 35, 44, 54, 65, 77, 90, 104, 119, 135, ...
const diagNum = x => x * (x + 3) / 2;
// Seq: 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, ...
const triRoot = x => Math.floor((Math.sqrt(1 + 8 * x) - 1) / 2);
// Seq: 0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, ...
const triNum = x => x * (x + 1) / 2;

const rowOf = index => triRoot(index);
const colOf = index => index - triNum(triRoot(index));
const indexOf = (row, col) => row >= col ? triNum(row) + col : triNum(col) + row;
const spotOf = (index, row = rowOf(index), col = colOf(index)) => {
    const spot = {
        index,
        row,
        col
    };
    D(spot)
        .values({
            ofCol: col => spotOf(indexOf(row, col), row, col),
            ofRow: row => spotOf(indexOf(row, col), row, col)
        });
    return spot;
};

const describers = [
    (s, p) => `你觉得 ${s}是否${p}呢？"`,
    (s, p) => `${s}${p}`,
    (s, p) => `${s}不可能${p}`,
    (s, p) => `已知 ${s}${p}`,
    (s, p) => `已知 ${s}不可能${p}`,
    (s, p) => `假设 ${s}${p}`,
    (s, p) => `假设 ${s}不可能${p}`,
    (s, p) => `推断 ${s}${p}`,
    (s, p) => `推断 ${s}不可能${p}`
];
const colors = [
    ['..', 38, 2, 240, 240, 240],
    ['定', 32, 107],
    ['::', 97, 47],
    ['知', 90, 107, 1],
    ['知', 90, 107, 7],
    ['设', 91, 107, 1],
    ['设', 91, 107, 7],
    ['推', 32, 107],
    ['::', 97, 47]
];
const tint = (text, ...xs) => xs.length > 0 ? `\x1b[${xs.join(";")}m${text}\x1b[0m` : `${text}`;
const ofNonValue = {};
D(ofNonValue)
    .props({
        lsb() {
            throw new Error("value.undefined");
        }
    })
    .values({
        tinted: tint(...colors[0]),
        describe: describers[0]
    });
const ofValue = value => {
    const den = {
        value,
        lsb: value & 1
    };
    D(den)
        .values({
            tinted: tint(...colors[value]),
            describe: describers[value]
        });
    return den;
};
const denotationOf = value => value ? ofValue(value) : ofNonValue;

const dollarsOf = str => {
    let n = 0;
    let i = 0;
    while ((i = str.indexOf("$", i)) >= 0) {
        ++n;
        ++i;
    }
    return n;
};

const spotFormat = spot => `${fix(3)(spot.index)} -> (${fix(2)(spot.row)},${fix(2)(spot.col)})`;
const siteInspect = (site, extra = "") => `(${spotFormat(site.spot)} -> ${extra}${site.description}`;

const createGame = dimStrs => {

    const dimensions = [];
    const entries = [];

    const dimensionMap = new Map;
    const entryMap = new Map;

    dimStrs.forEach((dimStr, dindex) => {
        const dimItems = dimStr.split(/\//);
        if (dimItems.length != 5 || dollarsOf(dimItems[2]) > 5 || dollarsOf(dimItems[4]) > 5) {
            throw new Error("bad.dimentsion: " + dimStr);
        }

        const kind = dimItems[0];
        const replacement = (name, i) => () => `(?<${name}${i++}>.+?)`;
        const nomin = dimItems[2].replace(/\$/g, replacement('n', 0));
        const accus = dimItems[4].replace(/\$/g, replacement('a', 0));
        const subjectRegex = new RegExp(`^(${nomin})`);
        const predicateRegex = new RegExp(`(?<neg>不(可能)?)?${dimItems[3]}(${accus})$`);
        const matchSubject = (str) => {
            const m = str.match(subjectRegex);
            if (m) {
                const g = m.groups;
                return {
                    fullname: g.n0 || g.n1 || g.n2 || g.n3 || g.n4,
                    matched: m[0].length
                };
            }
        };
        const matchPredicate = (str) => {
            const m = str.match(predicateRegex);
            if (m) {
                const g = m.groups;
                return {
                    negative: !!g.neg,
                    fullname: g.a0 || g.a1 || g.a2 || g.a3 || g.a4,
                    matched: m[0].length
                };
            }
        };
        const dim = {
            index: dindex,
            kind,
            // subjectRegex,
            // predicateRegex
        };
        D(dim)
            .values({
                matchSubject,
                matchPredicate
            });
        dimensions.push(dim);
        dimensionMap.set(kind, dim);

        const entryItems = dimItems[1].split(/,/);
        if (dindex > 0 && entryItems.length != entries.length / dindex) {
            throw new Error("bad.entry: " + dimItems[1]);
        }

        entryItems.forEach((entryStr, eindex) => {
            const names = entryStr.split(/:/);
            const abbreviation = names[0];
            const fullname = names[names.length - 1];

            const nominatives = dimItems[2].replace(/\$/g, fullname).split(/\|/);
            const verb = dimItems[3];
            const accusatives = dimItems[4].replace(/\$/g, fullname).split(/\|/);

            const subject = nominatives[0];
            const predicate = verb + accusatives[0];

            const entry = {
                index: entries.length,
                dindex,
                eindex,
                abbreviation,
                fullname,
                // nominatives,
                // verb,
                // accusatives,
                subject,
                predicate
            };

            entries.push(entry);
            entryMap.set(String([dindex, eindex]), entry);
            entryMap.set(abbreviation, entry);
            entryMap.set(fullname, entry);
            nominatives.forEach(nomin => entryMap.set(nomin, entry));
            accusatives.forEach(accus => entryMap.set(accus, entry));

            dimensionMap.set(abbreviation, dim);
            dimensionMap.set(fullname, dim);
            nominatives.forEach(nomin => dimensionMap.set(nomin, dim));
            accusatives.forEach(accus => dimensionMap.set(accus, dim));
        });
    });

    const dimensionOf = x => dimensionMap.get(String(x)) || dimensions[x];
    const entryOf = x => entryMap.get(String(x)) || entries[x];

    const numberOfDimensions = dimensions.length;
    const numberOfEntries = entries.length;
    const numberOfEntriesPerDimension = numberOfEntries / numberOfDimensions;
    const sizeOfMatrix = triNum(numberOfEntries);

    const createMatrix = () => {
        const matrix = Array(sizeOfMatrix);
        for (let i = 0; i < numberOfDimensions; i++) {
            const offset = i * numberOfEntriesPerDimension;
            for (let x = 0; x < numberOfEntriesPerDimension; x++) {
                const row = x + offset;
                matrix[indexOf(row, row)] = 1;
                for (let y = 0; y < x; y++) {
                    const col = y + offset;
                    matrix[indexOf(row, col)] = 2;
                }
            }
        }
        return matrix;
    };

    const titleOf = (row) => tint(nat(row).map(i => entries[i].abbreviation).toArray().join(" "), 90);
    const toString = matrix => {
        const m = numberOfEntriesPerDimension;
        const n = numberOfEntries;
        let str = "";
        for (let row = m; row < n; row++) {
            if (row > 0 && row % m == 0) {
                str += "  " + titleOf(row) + "\n";
            }
            str += " ";
            for (let col = 0; col < row - (row % m); col++) {
                const den = denotationOf(matrix[indexOf(row, col)]);
                str += tint("|", col % m == 0 ? 90 : 37);
                str += den.tinted;
            }
            str += tint("|", 90) + tint(entries[row].abbreviation, 90) + "\n";
        }
        str += "  " + titleOf(n - m);
        return str;
    };
    const printMatrix = matrix => println(toString(matrix));
    const sp78 = " ".repeat(78);
    const printMatrixAt = (x = 1, y = 1) => matrix => {
        const str = toString(matrix)
            .split(/\n/)
            .map((s, i) => `\x1b[${y}G` + (i > 0 ? `\x1b[B` : ``) + `${sp78}\x1b[${y}G` + s)
            .join("");
        process.stdout.write(`\x1b[${x};${y}H` + str + `\n`);
    };

    const siteOf = (spot, den) => {
        const rowEntry = entries[spot.row];
        const colEntry = entries[spot.col];
        const rowDim = dimensions[rowEntry.dindex];
        const colDim = dimensions[colEntry.dindex];
        const subject = rowEntry.subject;
        const predicate = colEntry.predicate;
        const description = den.describe(subject, predicate);
        return {
            spot,
            den,
            dim: {
                row: rowDim,
                col: colDim
            },
            entry: {
                row: rowEntry,
                col: colEntry
            },
            subject,
            predicate,
            description
        };
    };

    const actionOf = (index, valueToSet, causes = []) => {
        const action = {
            index,
            valueToSet,
            causes
        };
        D(action)
            .values({
                siteOf() {
                    return siteOf(spotOf(index), denotationOf(valueToSet));
                },
                describe(matrix) {
                    return causes.map(i => {
                        const spot = spotOf(i);
                        const den = denotationOf(matrix[i]);
                        return siteInspect(siteOf(spot, den));
                    });
                }
            });
        return action;
    };

    const lookupSubject = function* (statStr) {
        for (let i = 0; i < numberOfDimensions; i++) {
            const m = dimensions[i].matchSubject(statStr);
            if (m) yield m;
        }
    };
    const lookupPredicate = function* (statStr) {
        for (let i = 0; i < numberOfDimensions; i++) {
            const m = dimensions[i].matchPredicate(statStr);
            if (m) yield m;
        }
    };
    const lookupStatement = statStr => {
        for (let resSubject of lookupSubject(statStr)) {
            const rowEntry = entryMap.get(resSubject.fullname);
            if (!rowEntry) continue;
            const strRest = statStr.substring(resSubject.matched);
            const restLen = strRest.length;
            for (let resPredicate of lookupPredicate(strRest)) {
                if (resPredicate.matched != restLen) continue;
                const colEntry = entryMap.get(resPredicate.fullname);
                if (!colEntry) continue;
                return {
                    row: rowEntry.index,
                    col: colEntry.index,
                    negative: resPredicate.negative
                };
            }
        }
    };
    const actionFromStatement = (value = 3) => (statStr) => {
        const res = lookupStatement(statStr);
        if (res) {
            const index = indexOf(res.row, res.col);
            const valueToSet = value + Number(res.negative);
            return actionOf(index, valueToSet);
        }
        throw new Error(`bad.statement: ${statStr}`);
    };

    const statementOf = (row, col, negative) => {
        const spot = spotOf(indexOf(row, col));
        const subject = entries[spot.row].subject;
        const predicate = entries[spot.col].predicate;
        const den = denotationOf(negative ? 2 : 1);
        return den.describe(subject, predicate);
    };

    return {
        dimensions,
        entries,
        dimensionOf,
        entryOf,
        numberOfDimensions,
        numberOfEntries,
        numberOfEntriesPerDimension,
        sizeOfMatrix,
        createMatrix,
        printMatrix,
        printMatrixAt,
        siteOf,
        actionOf,
        actionFromStatement,
        statementOf
    };
};

const addConnection = (game, snapshot, stack, spot, negative, spotEvidence, spotConnected) => {
    const denEvidence = denotationOf(snapshot[spotEvidence.index]);
    if (!denEvidence.value) return;
    if (negative && !denEvidence.lsb) return;

    const valueToSet = negative ? 8 : 8 - denEvidence.lsb;
    const denConnected = denotationOf(snapshot[spotConnected.index]);

    if (!denConnected.value) {
        stack.push(game.actionOf(spotConnected.index, valueToSet, [spot.index, spotEvidence.index]));
        return spotConnected;
    }
    if (denConnected.lsb != denotationOf(valueToSet).lsb) {
        throw new Error(`collision: ${spotFormat(spotConnected)} -> ${denConnected.value} -> ${valueToSet}`);
    }
};

const closureOf = (game, matrix, action) => {
    const closure = [];
    const indexSet = new Set;
    const snapshot = matrix.slice();
    const stack = [action];

    while (stack.length > 0) {
        const focus = stack.pop();
        if (indexSet.has(focus.index)) continue;

        const spot = spotOf(focus.index);
        const den = denotationOf(focus.valueToSet);

        const denFocus = denotationOf(snapshot[focus.index]);
        if (denFocus.value) {
            throw new Error(`rewrite: ${spotFormat(spot)} -> ${denFocus.value} -> ${den.value}`);
        }

        indexSet.add(spot.index);
        snapshot[spot.index] = den.value;
        closure.push(focus);

        const negative = !den.lsb;
        for (let i = 0; i < game.numberOfEntries; i++) {
            const spotRow = spot.ofRow(i);
            const spotCol = spot.ofCol(i);
            addConnection(game, snapshot, stack, spot, negative, spotRow, spotCol);
            addConnection(game, snapshot, stack, spot, negative, spotCol, spotRow);
        }
    }

    return {
        action,
        closure,
        snapshot
    };
};

const createPlayer = (game, presets = []) => {

    const matrix = game.createMatrix();

    const executed = [];
    const actionMap = new Map;

    const clone = () => createPlayer(game, executed);

    const execute = action => {
        const actions = Array.isArray(action) ? action : [action];
        actions.forEach(action => {
            const res = closureOf(game, matrix, action);
            executed.push(action);
            actionMap.set(action.index, res);
            res.closure.forEach(focus => matrix[focus.index] = focus.valueToSet);
        });
    };

    execute(presets);

    const lastAction = () => {
        if (executed.length == 0) throw new Error("no.action.performed");
        return actionMap.get(executed[executed.length - 1].index);
    };

    const undo = () => {};

    const siteOf = index => game.siteOf(spotOf(index), denotationOf(matrix[index]));

    const printMatrix = () => game.printMatrix(matrix);
    const printMatrixAt = (x = 1, y = 1) => () => game.printMatrixAt(x, y)(matrix);

    return {
        matrix,
        executed,
        clone,
        execute,
        lastAction,
        undo,
        siteOf,
        printMatrix,
        printMatrixAt
    };
};

const K = createGame([
    `房号/一,二,三,四,五/住$号房子的人|$号房子主人/住/$号房子`,
    `国家/英:英国,瑞:瑞典,丹:丹麦,挪:挪威,德:德国/$人/是/$人`,
    `颜色/红,绿,白,黄,蓝/$色房子主人|住$色房子的人/住/$色房子`,
    `饮料/茶,咖:咖啡,奶:牛奶,啤:啤酒,水/喝$的人/喝/$`,
    `香烟/长:长红牌,登:登喜路,混:混合型,师:蓝色大师,王:王子牌/抽$香烟的人/抽/$香烟`,
    `宠物/狗,鸟,猫,马,鱼/养$的人/养/$`
]);

// console.dir(K, {
//     depth: null
// });

// 1、英国人住红色房子
// 2、瑞典人养狗
// 3、丹麦人喝茶
// 4、绿色房子在白色房子左面 @@
// 5、绿色房子主人喝咖啡
// 6、抽 Pall Mall 香烟的人养鸟
// 7、黄色房子主人抽 Dunhill 香烟
// 8、住在中间房子的人喝牛奶
// 9、 挪威人住第一间房
// 10、抽 Blends 香烟的人住在养猫的人隔壁 @@
// 11、养马的人住抽 Dunhill 香烟的人隔壁 @@
// 12、抽 Blue Master 的人喝啤酒
// 13、德国人抽 Prince 香烟
// 14、挪威人住蓝色房子隔壁 @@
// 15、抽 Blends 香烟的人有一个喝水的邻居 @@

const presets = [
    "英国人住红色房子", // 1
    "瑞典人养狗", // 2
    "丹麦人喝茶", // 3
    "绿色房子主人喝咖啡", // 5
    "抽长红牌香烟的人养鸟", // 6
    "黄色房子主人抽登喜路香烟", // 7
    "住三号房子的人喝牛奶", // 8
    "挪威人住一号房子", // 9
    "抽蓝色大师香烟的人喝啤酒", // 12
    "德国人抽王子牌香烟", // 13

    "一号房子主人不住白色房子", // 4
    "五号房子主人不住绿色房子", // 4
    "抽混合型香烟的人不养猫", // 10
    "抽登喜路香烟的人不养马", // 11
    // "红色房子主人不住四号房子", // 1 ?
    "挪威人不住蓝色房子", // 14
    "蓝色房子主人住二号房子", // 14 & 9
    "抽混合型香烟的人不喝水" // 15
].map(K.actionFromStatement(3));

// println(presets);

const P = createPlayer(K, presets);
P.printMatrixAt()();

const turns = [
    "红色房子主人住三号房子",
    "英国人抽长红牌香烟",
    "喝水的人抽登喜路香烟",
    "瑞典人住五号房子",
    "丹麦人住二号房子",
    "德国人住四号房子",
    "德国人不养马",
    "德国人养鱼",
    "二号房子主人抽混合型香烟",
    "喝咖啡的人抽王子牌香烟",
    "白色房子主人住五号房子",
    "黄色房子主人住一号房子",
    "白色房子主人喝啤酒",
    "养马的人住二号房子",
    "养猫的人住一号房子"
].map(K.actionFromStatement(5));

P.execute(turns);
// P.printMatrixAt(1, 88)();
// P.printMatrixAt()();

// println(K.statementOf(17, 14));
// println(P.siteOf(indexOf(17, 14)));
// P.execute(K.actionFromStatement(7)("喝啤酒的人住白色房子"));
// println(P.lastAction());
