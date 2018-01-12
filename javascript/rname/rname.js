
const crypto = require("crypto");

const words = [
		"天.地.风.云.昏雷.微雨.雪.雾.青霞.果.凤梨.虎儿.一物.忆粮.火烛.铜钿.星.尾.蛇蝎.牡丹.橘子.枫.过客.鸟.婵娟.冰凌.游鱼.落花.流水.酒肉.新瓶.旧酒.情人.禁城.鸥.鸣虫.三月.蜻蜓.红柳.芨芨草.子规.玻璃.三叶草.流苏.秋虫",
		"淡.轻轻.娓娓.美.雅.祉福.暗淡.蔼蔼.含韵.怒.沉默.夜.狂.滔滔.大大.红.江边.渺渺.无情.有意.独孤.恢恢.心醉.悠悠.浩.焱.魅惑.脉脉.翠.单.匆匆.吻香.隐约.有声.贵.儒雅.美伦.美焕.多愁.多情.庸庸.浅.蓝.艳.肥",
		"之.也.乎.亦.欲.勿.尚可.岂不.妄自.从容.浑.不解.爱.淋漓.不忍.胡.遍.尝.独.乃.知否.玩味.悉.察.兮.勤.转.如.复.附.毋.弗.难.更.又.再.新.数.到.待.成.戏.执着.尽.时.常.胜.喜.应.却.既.于.皆.无奈.可",
		"逗.闪.掖.搭讪.抹.寻.笑.战.颂.一.九.久.议.掩.曰.抑.锁.梦.闹.坐.甩.挽.见.呼.落.蔽.对.飞飞.惜.亲密.欢爱.凝.孑然.评.领.圆.秀.醉.翱翔.回眸.小别.追忆.倾听.夺.倚.扶.弄.竞.覆.揽.览.舞.抚.立.唱.焯",
		"酣.畅快.红唇.无语.闹.巍巍.夫.君.妻.一女.纯情.悦己.蹒跚.囧.簌簌.若闲.寂.晴.荡舟.暮阳.味道.浮云.娉婷.彷徨.踯躅.徘徊.都市.子夜.无踪.无悔.情愫.神秘.一瞥.七分.情人.苍生.滂沱.半斤.轻松.快乐.光阴.风筝.素笺.尘埃.不归.无情.永恒.青涩.呢哝"
	].map(s => s.split("."));

const I = x => x;
const K = x => y => x;

const ngen = function* (n) { for (let i = 0; i < n; i++) yield i; };
const nmap = f => function* (n) { for (let i = 0; i < n; i++) yield f(i, n); };
const nfoldl = (m, f) => n => { let s = m; for (let i = 0; i < n; i++) s = f(s, i, n); return s; };
const nfoldr = (m, f) => n => { let s = m; for (let i = n - 1; i >= 0; i--) s = f(i, s, n); return s; };
const nrep = f => n => { let s = null; for (let i = 0; i < n; i++) s = f(i, n, s); return s; };

const map = f => function* (it) { for (let x of it) yield f(x); };
const imap = f => function* (it) { let i = 0; for (let x of it) yield f(x, i++); };

const foldl = (m, f) => it => { for (let x of it) m = f(m, x); return m; };
const ifoldl = (m, f) => it => { let i = 0; for (let x of it) m = f(m, x, i++); return m; };

const foldr = (m, f) => it => {
	const rec = (m, it) => {
		const w = it.next();
		return w.done ? m : f(w.value, rec(m, it));
	};
	return rec(m, it);
};
const ifoldr = (m, f) => it => {
	const rec = (m, it, i) => {
		const w = it.next();
		return w.done ? m : f(w.value, rec(m, it, i + 1), i);
	};
	return rec(m, it, 0);
};

const each = f => it => { for (let x of it) f(x); };
const ieach = f => it => { let i = 0; for (let x of it) f(x, i++); };

const sum = a => a.reduce((x, y) => x + y);
const mean = a => sum(a) / a.length;
const devs = a => { const m = mean(a); return a.map(x => x - m); };
const stddev = a => { const s = sum(a); return Math.sqrt(sum(devs(a).map(x => x * x)) / (a.length - 1)); };

const r53 = _ => {
	const b = crypto.randomBytes(7);
	const hi = ((b[0] & 0x1f) << 16) | ((b[1] & 0xff) << 8)  |  (b[2] & 0xff);
	const lo = ((b[3] & 0xff) << 24) | ((b[4] & 0xff) << 16) | ((b[5] & 0xff) << 8) | (b[6] & 0xff);
	return (hi * 0x100000000) + (lo & 0xffffffff);
};
const random = n => {
	const r = 0x1fffffffffffff % n, max = 0x1fffffffffffff - r;
	while (true) {
		const x = r53();
		if (x < max) return x % n;
	}
};

// Marsaglia polar method
// https://en.wikipedia.org/wiki/Marsaglia_polar_method
const norm = (_ => {
    let u = 0, v = 0, w = 0, flag = false;
    const st = _ => {
    	if (flag) {
    		u = v;
    		flag = false;
    	} else {
		    do {
		        u = Math.random() * 2.0 - 1.0;
		        v = Math.random() * 2.0 - 1.0;
		        w = u * u + v * v;
		    } while (w >= 1.0 || w == 0.0);
		    w = Math.sqrt(-2.0 * Math.log(w) / w);
    		flag = true;
    	}
    	return u * w;
    };
    return (m = 0.0, s = 1.0) => m + s * st();
})();
const gauss = (n, delta) => {
	let x = 0;
	while (true) {
		x = Math.floor(norm(n, delta / 5));
		if (x >= n - delta && x < n + delta) return x;
	}
};

const rwords = words => {
	const f = (m, i) => {
		m[i] = words[i][random(words[i].length)];
		return m;
	};
	return nfoldl(Array(words.length), f)(words.length);
};
const rname = words => rwords(words).join("");

const println = s => console.log(s);
const iprintln = (s, i) => console.log(i + ": " + s);

const testF = f => n => {
	const a = Array(n);
	nrep(i => a[i] = 0)(n);
	nrep(i => a[f(i, n)]++)(n * 0x10000);
	ieach(iprintln)(a);
	println("sum: " + sum(a) + ", mean: " + mean(a) + ", stddev: " + stddev(a));
};
const test1 = testF((i, n) => random(n));
const test2 = testF((i, n) => Math.floor(n * Math.random()));
const test3 = testF((i, n) => gauss(n >> 1, n >> 1));
const test = n => nrep(i => iprintln(rname(words), i))(n);

test1(32);
test2(32);
test3(32);
// test(20);
