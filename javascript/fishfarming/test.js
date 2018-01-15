"use strict"

const {
	println,
	xprintln,
	debug,
	debug2,
	fix,
	D
} = require("./common");
const G = require("./generator");
const U = require("./util");

bindex = U.blockIndex([3, 4, 2, 1]);
bindex(15);


gv = (u, v) => i => {
	const uv = u * v,
		q = Math.trunc(i / uv),
		tr = U.triRoot(q),
		tn = U.triNum(tr),
		d = tn * uv,
		l = (tr + 1) * v;
	const {
		quot: row,
		rem: col
	} = U.div(i - d + tr * l * v, l), {
		quot: kcol,
		rem: icol
	} = U.div(col, v);
	return [i, q + kcol, d + kcol * v, l, row, col, tr + 1, row - tr * u, kcol, icol];
};

pv = (u, v) => G.nat(U.triNum(Math.max(u, v)) * u * v).map(gv(u, v)).group(a => a[4], []).map(as => fix(2)(as[0][4]) + " " + fix(2)(as[0][6]) + " | " + as.reduce((m, a, i) => (m[Math.trunc(i / v)].push(a), m), G.nat(1 + Math.trunc(as[0][4] / v)).map(i => []).toArray()).map(as => as.map(a => fix(3)(a[0])).join(" ")).join(" | ") + " |").forEach(println)

//       ----------------------------------------------------
//       | 00 01 02 03 04 | 05 06 07 08 09 | 10 11 12 13 14 |
//       | 一 二 三 四 五 | 英 瑞 丹 挪 德 | 红 蓝 绿 黄 白 |
// ----------------------------------------------------------
// 00 一 | 00             |                |                |
// 01 二 | 01 02          |                |                |
// 02 三 | 03 04 05       |                |                |
// 03 四 | 06 07 08 09    |                |                |
// 04 五 | 10 11 12 13 14 |                |                |
// ----------------------------------------------------------
// 05 英 | 15 16 17 18 19 | 20             |                |
// 06 瑞 | 21 22 23 24 25 | 26 27          |                |
// 07 丹 | 28 29 30 31 32 | 33 34 35       |                |
// 08 挪 | 36 37 38 39 40 | 41 42 43 44    |                |
// 09 德 | 45 46 47 48 49 | 50 51 52 53 54 |                |
// ----------------------------------------------------------
// 10 红 | 55 56 57 58 59 | 60 61 62 63 64 | 65             |
// 11 蓝 | 66 67 68 69 70 | 71 72 73 74 75 | 76 77          |
// 12 绿 | 78 79 80 81 82 | 83 84 85 86 87 | 88 89 90       |
// 13 黄 | 91 92 93 94 95 | 96 97 98 99 00 | 01 02 03 04    |
// 14 白 | 05 06 07 08 09 | 10 11 12 13 14 | 15 16 17 18 19 |
// ----------------------------------------------------------

//          00  01  02  03  04
//       -----------------------
// 00 01 | 000 001 002 003 004 |
// 01 01 | 005 006 007 008 009 |
// 02 01 | 010 011 012 013 014 |
// 03 01 | 015 016 017 018 019 |
// 04 01 | 020 021 022 023 024 |  05  06  07  08  09
//       ---------------------------------------------
// 05 02 | 025 026 027 028 029 | 030 031 032 033 034 |
// 06 02 | 035 036 037 038 039 | 040 041 042 043 044 |
// 07 02 | 045 046 047 048 049 | 050 051 052 053 054 |
// 08 02 | 055 056 057 058 059 | 060 061 062 063 064 |
// 09 02 | 065 066 067 068 069 | 070 071 072 073 074 |  10  11  12  13  14
//       -------------------------------------------------------------------
// 10 03 | 075 076 077 078 079 | 080 081 082 083 084 | 085 086 087 088 089 |
// 11 03 | 090 091 092 093 094 | 095 096 097 098 099 | 100 101 102 103 104 |
// 12 03 | 105 106 107 108 109 | 110 111 112 113 114 | 115 116 117 118 119 |
// 13 03 | 120 121 122 123 124 | 125 126 127 128 129 | 130 131 132 133 134 |
// 14 03 | 135 136 137 138 139 | 140 141 142 143 144 | 145 146 147 148 149 |  15  16  17  18  19
//       -----------------------------------------------------------------------------------------
// 15 04 | 150 151 152 153 154 | 155 156 157 158 159 | 160 161 162 163 164 | 165 166 167 168 169 |
// 16 04 | 170 171 172 173 174 | 175 176 177 178 179 | 180 181 182 183 184 | 185 186 187 188 189 |
// 17 04 | 190 191 192 193 194 | 195 196 197 198 199 | 200 201 202 203 204 | 205 206 207 208 209 |
// 18 04 | 210 211 212 213 214 | 215 216 217 218 219 | 220 221 222 223 224 | 225 226 227 228 229 |
// 19 04 | 230 231 232 233 234 | 235 236 237 238 239 | 240 241 242 243 244 | 245 246 247 248 249 |  20  21  22  23  24
//       ---------------------------------------------------------------------------------------------------------------
// 20 05 | 250 251 252 253 254 | 255 256 257 258 259 | 260 261 262 263 264 | 265 266 267 268 269 | 270 271 272 273 274 |
// 21 05 | 275 276 277 278 279 | 280 281 282 283 284 | 285 286 287 288 289 | 290 291 292 293 294 | 295 296 297 298 299 |
// 22 05 | 300 301 302 303 304 | 305 306 307 308 309 | 310 311 312 313 314 | 315 316 317 318 319 | 320 321 322 323 324 |
// 23 05 | 325 326 327 328 329 | 330 331 332 333 334 | 335 336 337 338 339 | 340 341 342 343 344 | 345 346 347 348 349 |
// 24 05 | 350 351 352 353 354 | 355 356 357 358 359 | 360 361 362 363 364 | 365 366 367 368 369 | 370 371 372 373 374 |
//       ---------------------------------------------------------------------------------------------------------------


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
