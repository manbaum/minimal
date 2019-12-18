G = require("./generator");

id = x => x;
add = (x, y) => x + y;
eq = (x, y) => x == y;
aeq = (xs, ys) => {
	if (xs.length != ys.length) return false;
	const n = xs.length;
	for (let i = 0; i < n; i++) {
		if (xs[i] != ys[i]) return false;
	}
	return true;
};
watch = f => {
	const begin = Date.now();
	f();
	return Date.now() - begin;
};
testn = n => f => watch(_ => {
	for (let i = 0; i < n; i++) f();
}) / n;
testng = n => genF => f => testn(n)(_ => G.map(f)(genF()).forEach(id));
testeq = cmp => f1 => f2 => G.filter(x => !cmp(f1(x), f2(x)));
test = f => testng(500)(_ => G.nat(10240))(f);

norm = a => a.length > 0 ? a.map(i => (i % 12) + (i >= 0 ? 0 : 12)) : a;
anorm = a => a.length > 0 ? a.map(i => ((i - a[0]) % 12) + (i >= a[0] ? 0 : 12)) : a;
rot = n => a => a.length > 0 && (n = n % a.length + (n >= 0 ? 0 : a.length), n > 0) ? a.slice(n).concat(a.slice(0, n)) : a;
inv = n => a => a.length > 0 ? anorm(rot(n)(a)) : a;
perm = a => {
	const as = [],
		n = a.length;
	if (n <= 1) {
		as.push(a.slice());
	} else {
		const w = a.slice(),
			c = new Array(n).fill(0);
		let k, p, i = 1;
		as.push(w.slice());
		while (i < n) {
			if (c[i] < i) {
				k = i % 2 && c[i];
				p = w[i];
				w[i] = w[k];
				w[k] = p;
				as.push(w.slice());
				++c[i];
				i = 1;
			} else {
				c[i] = 0;
				++i;
			}
		}
	}
	return as;
};

Function.prototype._ = function(strings) {
	const THIS = this;
	switch (strings[0].charCodeAt(0)) {
		case 46:
			return cb => (...args) => THIS(cb.apply(null, args));
		case 36:
			return (...args) => Function.prototype.bind.apply(THIS, args);
	}
};


$1 = ([first]) => first;
$2 = ([, second]) => second;
$3 = ([, , third]) => third;
compose = (...fs) => x => {
	const n = fs.length;
	for (let i = n - 1; i >= 0; i--) {
		x = fs[i](x);
	}
	return x;
};

c0 = (...fs) => Array.prototype.reduceRight.bind(fs, (m, f) => f(m));
c1 = (...fs) => x => fs.reduceRight((m, f) => f(m), x);
c2 = (...fs) => fs.reduceRight((m, f) => x => f(m(x)));
c3 = (...fs) => x => {
	const n = fs.length;
	for (let i = n - 1; i >= 0; i--) {
		x = fs[i](x);
	}
	return x;
};
c4 = (...fs) => {
	const n = fs.length;
	let s = "x";
	for (let i = n - 1; i >= 0; i--) {
		s = `fs[${i}](${s})`;
	}
	return Function("fs", `return x => ${s}`)(fs);
};

f = x => x + 1;
g = x => 2 * x;
z = x => g(f(g(f(g(f(g(f(g(f(x))))))))));
z0 = c0(g, f, g, f, g, f, g, f, g, f);
z1 = c1(g, f, g, f, g, f, g, f, g, f);
z2 = c2(g, f, g, f, g, f, g, f, g, f);
z3 = c3(g, f, g, f, g, f, g, f, g, f);
z4 = c4(g, f, g, f, g, f, g, f, g, f);
t = n => [z, z0, z1, z2, z3, z4].map(f => testn(n)(_ => f(1)));

[z(1), z0(1), z1(1), z2(1), z3(1), z4(1)];

signAndValue = value => [Math.sign(value) + 0, Math.abs(value)];
safeInt = value => {
	const number = Number(value);
	if (isNaN(number) || number === 0) {
		return 0;
	} else if (Number.isSafeInteger(number)) {
		return number;
	} else {
		const [sgn, abs] = signAndValue(Math.trunc(number));
		return sgn * Math.min(abs, Number.MAX_SAFE_INTEGER);
	}
};
clamp = (min, max) => x => Math.max(min, Math.min(max, x));
isBetween = (min, max) => x => x >= min && x <= max;
div = (dividend, divisor) => {
	const q = Math.trunc(dividend / divisor),
		r = dividend % divisor;
	if (divisor > 0) {
		return r >= 0 ? [q, r] : [q - 1, r + divisor];
	} else {
		return r <= 0 ? [q, r] : [q - 1, r + divisor];
	}
};

T = (strings, ...indexes) => (...args) => {
	let s = "";
	const n = strings.length;
	for (let i = 0; i < n; i++) {
		s += strings[i];
		s += args[indexes[i]];
	}
	return s;
};
validatorOf = (isValid, messager) => (value, ...args) => {
	if (!isValid(value)) {
		throw new Error(messager(value, ...args));
	}
};

isValidNote = isBetween(-60, 71);
isValidPitchClass = isBetween(0, 11);
isValidOctave = isBetween(-5, 5);
isValidSolfa = isBetween(1, 7);
isValidAccidental = isBetween(-11, 11);
isValidSolfaNote = RegExp.prototype.test.bind(/^(#{1,11}|b{1,11})?[1-7](<[2-5]?|>[2-5]?)?$/);

checkNote = validatorOf(isValidNote, T `Invalid note: ${0}`);
checkPitchClass = validatorOf(isValidPitchClass, T `Invalid pitch class: ${0}`);
checkOctave = validatorOf(isValidOctave, T `Invalid octave number: ${0}`);
checkSolfa = validatorOf(isValidSolfa, T `Invalid solfa number: ${0}`);
checkAccidental = validatorOf(isValidAccidental, T `Invalid accidental number: ${0}`);
checkSolfaNote = validatorOf(isValidSolfaNote, T `Invalid solfa notation: ${0}`);

noteToPitch = note => {
	const [octave, pitch] = div(note + 60, 12);
	return [pitch, 0, octave - 5];
};
pitchToNote = ([pitch, accidental = 0, octave = 0]) => {
	return pitch + accidental + 12 * octave;
};
reduceAccidental = ([pitch, accidental = 0, octave = 0]) => {
	const [p, , o] = noteToPitch(pitch + accidental);
	return [p, 0, o + octave];
};

pitchToLetter = (preferSharp = true, reduceAcc = false) => ([pitch, accidental = 0, octave = 0]) => {
	const [p, , o] = noteToPitch(reduceAcc ? pitch + accidental : pitch),
		a = ((p >= 5 ? p - 1 : p) & 1) * (preferSharp ? 1 : -1),
		n = (p - a + (p < 5 ? 0 : 1)) / 2,
		letter = 65 + (n + 2) % 7;
	return [letter, reduceAcc ? a : accidental + a, octave + o];
};
letterToPitch = ([letter, accidental = 0, octave = 0]) => {
	const n = (letter - 60) % 7,
		pitch = n * 2 - (n < 3 ? 0 : 1);
	return [pitch, accidental, octave];
};

countSharpOfKeyPitch = keyPitch => {
	const [, n] = div(keyPitch * 7, 12);
	return n;
};
sharpPitchSetOfKeyPitch = keyPitch => {
	const a = [],
		n = countSharpOfKeyPitch(keyPitch);
	for (let i = 0; i < n; i++) {
		const pitch = (5 + i * 7) % 12;
		a.push(pitch);
	}
	return a;
};
sharpLetterSetOfKeyPitch = keyPitch => {
	return sharpPitchSetOfKeyPitch(keyPitch).map(pitch => {
		const [letter, accidental] = pitchToLetter(true)([pitch, 0, 0]);
		return [letter, accidental];
	});
};
countFlatOfKeyPitch = keyPitch => {
	const [, n] = div(keyPitch * 5, 12);
	return n;
};
flatPitchSetOfKeyPitch = keyPitch => {
	const a = [],
		n = countFlatOfKeyPitch(keyPitch);
	for (let i = 0; i < n; i++) {
		const pitch = (11 + i * 5) % 12;
		a.push(pitch);
	}
	return a;
};
flatLetterSetOfKeyPitch = keyPitch => {
	return flatPitchSetOfKeyPitch(keyPitch).map(pitch => {
		const [letter, accidental] = pitchToLetter(false)([pitch, 0, 0]);
		return [letter, accidental];
	});
};

countSharpOfKeyLetter = (keyLetter, keyAccidental = 0) => {
	const [keyPitch] = letterToPitch([keyLetter, keyAccidental, 0]);
	return countSharpOfKeyPitch(keyPitch);
};
sharpPitchSetOfKeyLetter = (keyLetter, keyAccidental = 0) => {
	const [keyPitch] = letterToPitch([keyLetter, keyAccidental, 0]);
	return sharpPitchSetOfKeyPitch(keyPitch);
};
sharpLetterSetOfKeyLetter = (keyLetter, keyAccidental = 0) => {
	const [keyPitch] = letterToPitch([keyLetter, keyAccidental, 0]);
	return sharpLetterSetOfKeyPitch(keyPitch);
};

countFlatOfKeyLetter = (keyLetter, keyAccidental = 0) => {
	const [keyPitch] = letterToPitch([keyLetter, keyAccidental, 0]);
	return countFlatOfKeyPitch(keyPitch);
};
flatPitchSetOfKeyLetter = (keyLetter, keyAccidental = 0) => {
	const [keyPitch] = letterToPitch([keyLetter, keyAccidental, 0]);
	return flatPitchSetOfKeyPitch(keyPitch);
};
flatLetterSetOfKeyLetter = (keyLetter, keyAccidental = 0) => {
	const [keyPitch] = letterToPitch([keyLetter, keyAccidental, 0]);
	return flatLetterSetOfKeyPitch(keyPitch);
};

letterToKeyName = ([letter, accidental]) => {
	const letterStr = String.fromCharCode(letter);
	const [sa, va] = signAndValue(accidental),
		accidentalStr = va > 0 ? ["b", "", "#"][sa + 1].repeat(va) : "";
	return accidentalStr + letterStr;
};
letterToNoteName = ([letter, accidental = 0, octave = 0]) => {
	const letterStr = String.fromCharCode(letter);
	const [sa, va] = signAndValue(accidental),
		accidentalStr = va > 0 ? ["b", "", "#"][sa + 1].repeat(va) : "";
	const octaveStr = String(octave + 4);
	return accidentalStr + letterStr + octaveStr;
};
keyPitchToKeyName = (preferSharp = true) => keyPitch => {
	const ns = countSharpOfKeyPitch(keyPitch),
		nf = countFlatOfKeyPitch(keyPitch),
		withSharp = preferSharp ? ns <= 7 : nf > 7,
		accidental = withSharp ? (ns > 5 ? 1 : 0) : (nf > 1 ? -1 : 0);
	return letterToKeyName(pitchToLetter(withSharp)([keyPitch - accidental, accidental, 0]));
};


prepareModeSolfaLookupTable = modePitchOffsetSet => {
	const table = Array(12),
		n = modePitchOffsetSet.length;
	if (n != 7) throw new Error("error.mode.pitch.offset.set");
	const fill = (offset, solfa, accidental) => {
		const [octave, index] = div(offset, 12);
		table[index] = [solfa, accidental, octave];
	};
	const loop = (n, dir, offset, solfa, accidental) => {
		if (dir >= 0) {
			for (let i = 1; i < n; i++) {
				fill(offset + i, solfa, accidental + i);
			}
		} else {
			for (let i = 1; i < n; i++) {
				fill(offset - i, solfa, accidental - i);
			}
		}
	};
	let firstOffset, firstSolfa, lastOffset, lastSolfa;
	for (let i = 0; i < n; i++) {
		const pitchOffset = modePitchOffsetSet[i];
		if (Number.isSafeInteger(pitchOffset)) {
			if (firstOffset == null) {
				fill(firstOffset = lastOffset = pitchOffset, firstSolfa = lastSolfa = i + 1, 0);
			} else {
				const count = pitchOffset - lastOffset + 1;
				if (count <= 1) throw new Error("error.mode.pitch.offset.set");
				if (pitchOffset - firstOffset >= 12) throw new Error("error.mode.pitch.offset.set");
				const half = count >>> 1;
				loop(count - half, 1, lastOffset, lastSolfa, 0);
				fill(lastOffset = pitchOffset, lastSolfa = i + 1, 0);
				loop(half, -1, lastOffset, lastSolfa, 0);
			}
		}
	}
	if (firstOffset == null) throw new Error("error.mode.pitch.offset.set");
	const count = (12 + firstOffset) - lastOffset + 1;
	const half = count >>> 1;
	loop(count - half, 1, lastOffset, lastSolfa, 0);
	loop(half, -1, firstOffset, firstSolfa, 0);
	return table;
};
IonianModePitchOffsetSet = [0, 2, 4, 5, 7, 9, 11];
solfaNumberToPitchClass = (keyPitchOffset = 0, modePitchOffsetSet = IonianModePitchOffsetSet) => {
	const n = modePitchOffsetSet.length;
	if (n != 7) throw new Error("error.mode.pitch.offset.set");
	return ([solfaNum, accValue, octaveValue]) => {
		const [solfaOctave, solfaIndex] = div(solfaNum - 1, 7);
		const [pitchOctave, pitchClass] = div(keyPitchOffset + modePitchOffsetSet[solfaIndex] + accValue, 12);
		return [pitchClass, octaveValue + solfaOctave + pitchOctave];
	};
};
pitchClassToSolfaNumber = (keyPitchOffset = 0, modePitchOffsetSet = IonianModePitchOffsetSet) => {
	const table = prepareModeSolfaLookupTable(modePitchOffsetSet);
	return ([pitchClass, octaveValue]) => {
		const [pitchOctave, pitchIndex] = div(pitchClass - keyPitchOffset, 12);
		const [solfaNum, accValue, solfaOctive] = table[pitchIndex];
		return [solfaNum, accValue, octaveValue + pitchOctave - solfaOctive];
	};
};


parseSolfaNote = solfaStr => {
	let state = 0,
		solfaNum = 0,
		accValue = 0,
		octaveValue = 0;
	const n = solfaStr.length;
	if (n == 0) return;
	for (let i = 0; i < n; i++) {
		const c = solfaStr.charCodeAt(i);
		if (c >= 49 && c <= 55) { // '1' - '7'
			if (state == 0) {
				state = 1;
				solfaNum = c - 48;
			} else if (state == 2) { // after '>'
				if (c == 49 || c > 53) return; // '1' or > '5'
				state = 4;
				octaveValue = c - 48;
			} else if (state == 3) { // after '<'
				if (c == 49 || c > 53) return; // '1' or > '5'
				state = 4;
				octaveValue = 48 - c;
			} else {
				return;
			}
		} else if (c == 35) { // '#'
			if (state != 0 || accValue < 0 || accValue > 10) return;
			++accValue;
		} else if (c == 98) { // 'b'
			if (state != 0 || accValue > 0 || accValue < -11) return;
			--accValue;
		} else if (c == 62) { // '>'
			if (state != 1) return;
			state = 2;
			octaveValue = 1;
		} else if (c == 60) { // '<'
			if (state != 1) return;
			state = 3;
			octaveValue = -1;
		} else {
			return;
		}
	}
	if (state > 0) {
		return [solfaNum, accValue, octaveValue];
	}
};
toSolfaNote = ([solfaNum, accValue, octaveValue]) => {
	const solfa = 1 + (solfaNum - 1) % 7 + (solfaNum < 1 ? 7 : 0),
		accStr = accValue != 0 ? (accValue > 0 ? "#" : "b").repeat(Math.abs(accValue)) : "";
	if (octaveValue != 0) {
		const octave = Math.abs(octaveValue),
			octaveStr = (octaveValue > 0 ? ">" : "<") + (octave > 1 ? String(octave) : "");
		return accStr + solfa + octaveStr;
	} else {
		return accStr + solfa;
	}
};
solfaNumberToNote = (keyPitchOffset = 0) => ([solfaNum, accValue, octaveValue]) => {
	const solfa = 1 + (solfaNum - 1) % 7 + (solfaNum < 1 ? 7 : 0),
		pitchClass = solfa * 2 - (solfa < 4 ? 2 : 3) + accValue + keyPitchOffset;
	return pitchClassToNote([pitchClass, octaveValue]);
};
fix = n => s0 => (s => (s.length < n ? " ".repeat(n - s.length) : "") + s)(String(s0));
fix4 = fix(4);
noteToSolfaNumber = (keyPitchOffset = 0, modePitchOffsetSet) => note => {
	const i = (note - keyPitchOffset) % 12,
		accValue = modePitchOffsetSet && modePitchOffsetSet[i] != null ? modePitchOffsetSet[i] : (i >= 5 ? i - 1 : i) & 1,
		pitchClass = (i - accValue) % 12 + (i - accValue < 0 ? 12 : 0),
		solfaNum = (pitchClass + (pitchClass >= 5 ? 3 : 2)) >>> 1,
		octaveValue = Math.trunc((note - keyPitchOffset - accValue) / 12) - 1;
	return [solfaNum, accValue, octaveValue];
};
// console.log(`note: ${fix4(note)}, i: ${fix4(i)}, pitchClass: ${fix4(pitchClass)}, solfaNum: ${fix4(solfaNum)}, accValue: ${fix4(accValue)}, octaveValue: ${fix4(octaveValue)}`);
solfaNoteToNote = (keyPitchOffset = 0) => {
	const toNote = solfaNumberToNote(keyPitchOffset);
	return solfaStr => {
		const a = parseSolfaNote(solfaStr);
		if (a) return toNote(a);
	};
};
noteToSolfaNote = (keyPitchOffset = 0, modePitchOffsetSet) => {
	const toSolfaNum = noteToSolfaNumber(keyPitchOffset, modePitchOffsetSet);
	return note => toSolfaNote(toSolfaNum(note));
};

rawNoteToPitch = note => {
	const [octave, pitchClass] = div(note, 12);
	return [pitchClass, 0, octave];
};
noteToPitch = note => rawNoteToPitch(safeInt(note));
rawPitchToNote = ([pitchClass, accidental, octave]) => {
	return pitchClass + accidental + 12 * octave;
};
pitchToNote = ([pitchClass, accidental, octave]) => rawPitchToNote([safeInt(pitchClass), safeInt(accidental), safeInt(octave)]);


noteToPitch = (note, withSharp = true) => {
	const [octave, pitchClass] = div(safeInt(note), 12),
		accidental = (r >= 5 ? r - 1 : r) & 1 ? (withSharp ? 1 : -1) : 0, [, p] = div(i - a, 12),
		return [pitchClass - accidental, accidental, q];
}

b = (ac = true) => i => {
	const [q, r] = div(i, 12),
		t = (r >= 5 ? r - 1 : r) & 1, [, p] = div(ac ? i - t : i + t, 12),
		a = t ? (ac ? 1 : -1) : 0;
	return [p, a, q];
};
bn = (ac = true) => {
	const bac = b(ac);
	return ([p, a = 0, q = 0]) => {
		const [pp, pa, pq] = bac(p),
			n = (pp + (pp >= 5 ? 3 : 2)) >>> 1;
		return [n, a + pa, q + pq];
	};
};
bs = (ac = true) => {
	const bnac = bn(ac);
	return ([n, a, q]) => {
		const [n, a, q] = bac(i);
		const sl = String.fromCharCode(65 + (n + 1) % 7);
		const sa = (a >= 0 ? "#" : "b").repeat(Math.abs(a));
		return [sa + sl, q];
	};
};
bfl = i => {
	const [n, a, q] = bfn(i);
	const sl = String.fromCharCode(65 + (n + 1) % 7);
	const sa = "b".repeat(-a);
	return [sa + sl, q];
};
bsw = i => {
	const [, r] = div(i * 7, 12);
	return r;
};
bfw = i => {
	const [, r] = div(i * 5, 12);
	return r;
};
bsk = i => {
	const a = [],
		[k] = bsl(i),
		n = bsw(i);
	for (let i = 0; i < n; i++) {
		const [sl] = bfl(5 + i * 7);
		a.push(sl);
	}
	return [k, a];
};
bfk = i => {
	const a = [],
		[k] = bfl(i),
		n = bfw(i);
	for (let i = 0; i < n; i++) {
		const [sl] = bsl(11 + i * 5);
		a.push(sl);
	}
	return [k, a];
};

h = f => i => (y => (x => (y ? (f < 0 ? "b" : "#") : "") + String.fromCharCode(65 + (x + 2) % 7))((i + (i >= 5 ? 1 : 0) + (f < 0 && y ? 2 : 0)) >>> 1))((i >= 5 ? i - 1 : i) & 1)
w = i => (x => (12 + x - ((x >= 5 ? x - 1 : x) & 1)) % 12)((60 - 5 * i) % 12)

k = f => i => h(f >= 0 ? 7 - w(i) : w(i) - 5)(i)

(x => 65 + (x + 5) % 7)((i + () + (f < 0 && ? 2 : 0)) >>> 1);

g = (n, m) => G.nat(n).map(i => div(i * m, n)[1]).toArray();
t = (n, m) => (a => G.nat(n).every(i => a[i] == a.indexOf(i)))(g(n, m));
f = (m, n) => G.nat(3000).filter(i => t(i, m)).take(n).toArray()

[0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7]
[0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]

[0, 1, 2, 3, 4, 5]


//        C   #C   D   #D   E   F   #F   G   #G   A   #A   B
//        C   bD   D   bE   E   F   bG   G   bA   A   bB   B
// 1=C    1   #1   2   #2   3   4   #4   5   #5   6   #6   7
//        "0    1   0    1   0   0    1   0    1   0    1   0"   0
//        1   b2   2   b3   3   4   b5   5   b6   6   b7   7
//        0   -1   0   -1   0   0   -1   0   -1   0   -1   0   0
// 1=D        7<   1        2        3   4        5        6
//        1   0    0    1   0   1    0   0    1   0    1   0  -2

solfaNumberToNote([1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0], -2)([1, 0, 4]) == 62

isAccidentalValue = accValue => Number.isSafeInteger(accValue) && Math.abs(accValue) <= 3;
pitchClassWithAccidental = (pitchClass, accValue) => (12 + pitchClass + accValue) % 12;
pitchClassWithAccidentalToNote = (pitchClass, accValue, octaveValue) => pitchClass + accValue + 12 * (octaveValue + 1);
noteToPitchClassWithAccidental = (note, pitchOffsetSet) => {
	const r = note % 12,
		pitchClass = (12 + pitchOffsetSet[r]) % 12,
		d = r - pitchClassBasis[r],
		accValue = d >= -3 && d <= 3 ? d : d + 12,
		octaveValue = Math.trunc((note - accValue) / 12) - 1;
	return [pitchClass, accValue, octaveValue];
};
pitchClassBasisOfSharps = [0, 0, 2, 2, 4, 5, 5, 7, 7, 9, 9, 11];
pitchClassBasisOfFlats = [0, 2, 2, 4, 4, 5, 7, 7, 9, 9, 11, 11];
noteToPitchClassWithSharp = note => noteToPitchClassWithAccidental(note, pitchClassBasisOfSharps);
noteToPitchClassWithFlat = note => noteToPitchClassWithAccidental(note, pitchClassBasisOfFlats);

//        C   #C   D   #D   E   F   #F   G   #G   A   #A   B
//        C   bD   D   bE   E   F   bG   G   bA   A   bB   B
// 1=C    1   #1   2   #2   3   4   #4   5   #5   6   #6   7
//        0   -1   0   -1   0   0   -1   0   -1   0   -1   0
//        1   b2   2   b3   3   4   b5   5   b6   6   b7   7
//        0    2   2    4   4   5    7   7    9   9   11  11
// 1=D        7<   1        2        3   4        5        6
//        1   0    0    1   0   1    0   0    1   0    1   0

solfa = ([p, a, o]) => [(a >= 0 ? "#" : "b").repeat(Math.abs(a)), 1 + ((p < 5 ? p : p + 1) >> 1), o != 0 ? (o > 0 ? ">" : "<") + Math.abs(o) : ""].join("");



isPitchLetter = pitchLetter => /^[A-G]$/.test(pitchLetter);
isLetterClass = letterClass => /^(#{1,3}|b{1,3})?[A-G]$/.test(letterClass);
isLetterNote = letterStr => /^(#{1,3}|b{1,3})?[A-G](-1|[0-9])?$/.test(letterStr);

fromSolfaNumber = (solfaNum, accClass, octaveClass) => fromPitchClass((solfaNum * 2) - (solfaNum >= 4 ? 3 : 2), accClass, octaveClass);
fromPitchLetter = (pitchLetter, accClass, octaveClass) => fromSolfaNumber(1 + (pitchLetter.charCodeAt(0) - 60) % 7, accClass, octaveClass);

fromNote = note => {
	if (isNote(note)) {
		if (note < 12) {
			return [0, note - 12, -1];
		} else if (note > 143) {
			return [11, note - 143, 9];
		} else {
			return fromNoteRaw(note);
		}
	}
};
pitchClassOf = note => {
	const a = fromNote(note);
	return a && a[0];
};
accidentalClassOf = note => {
	const a = fromNote(note);
	return a && a[1];
};
octaveClassOf = note => {
	const a = fromNote(note);
	return a && a[2];
};

solfaNotationOf = note => solfaNotationOf2(note, 0);
solfaNotationOf2 = (note, keyPitchClass) => {
	const a = fromNote(note - keyPitchClass);
	if (a) {
		const accMark = (a[1] >= 0 ? "###" : "bbb").substring(0, Math.abs(a[1])),
			solfaNum = (a[0] + (a[0] >= 5 ? 3 : 2)) >>> 1,
			octaveValue = a[2] - 4;
		let octaveMark = "";
		if (octaveValue > 0) {
			octaveMark = ">" + (octaveValue > 1 ? String(octaveValue) : "");
		} else if (octaveValue < 0) {
			octaveMark = "<" + (octaveValue < -1 ? String(-octaveValue) : "");
		}
		return accMark + String(solfaNum) + octaveMark;
	}
};
letterNotationOf = note => {
	const a = fromNote(note);
	if (a) {
		const accMark = (a[1] >= 0 ? "###" : "bbb").substring(0, Math.abs(a[1])),
			solfaNum = (a[0] + (a[0] >= 5 ? 3 : 2)) >>> 1,
			pitchLetter = String.fromCharCode(65 + (solfaNum + 1) % 7),
			octaveMark = String(a[2]);
		return accMark + pitchLetter + octaveMark;
	}
};


fromSolfaNotation = solfaStr => {
	let state = 0,
		pitchClass = -1,
		accClass = 0,
		octaveClass = 0;
	const n = solfaStr.length;
	for (let i = 0; i < n; i++) {
		const c = solfaStr.charCodeAt(i);
		if (c >= 49 && c <= 55) { /* '1' - '7'  */
			if (state == 0) {
				state = 1;
				rootPitchClass = (c - 48) * 2 - (c > 51 ? 3 : 2);
			} else if (state == 2) {
				if (c == 49) return -1;
				state = 4;
				octaveClass = c - 48;
			} else if (state == 3) {
				if (c == 49) return -1;
				state = 4;
				octaveClass = 16 - (c - 48);
			} else {
				return -1;
			}
		} else if (c == 35) { /* '#'' */
			if (state != 0 || deltaPitchClass < 0 || deltaPitchClass > 2) return -1;
			++deltaPitchClass;
		} else if (c == 98) { /* 'b' */
			if (state != 0 || deltaPitchClass > 0 || deltaPitchClass < -2) return -1;
			--deltaPitchClass;
		} else if (c == 62) { /* '>' */
			if (state != 1) return -1;
			state = 2;
			octaveClass = 1;
		} else if (c == 60) { /* '<' */
			if (state != 1) return -1;
			state = 3;
			octaveClass = 15;
		} else {
			return -1;
		}
	}
	return rootPitchClass + deltaPitchClass + octaveClass * 16;
};

solfaNumberFromPitchLetter = pitchLetter => 1 + (pitchLetter.charCodeAt(0) - 60) % 7;
pitchClassFromSolfaNumber = solfaNum => (solfaNum * 2) - (solfaNum >= 4 ? 3 : 2);
pitchClassFromPitchLetter = pitchLetter => pitchClassOfSolfaNumber(solfaNumberOfPitchLetter(pitchLetter));

solfaNumberFromPitchLetter2 = (pitchLetter, keyPitchClass) => 1 + (pitchLetter.charCodeAt(0) - 60) % 7;


pitchLetterFromSolfaNumber = solfaNum => String.fromCharCode(65 + (solfaNum + 1) % 7);
solfaNumberFromPitchClass = pitchClass => (pitchClass + (pitchClass >= 5 ? 3 : 2)) >>> 1;
pitchLetterFromPitchClass = pitchClass => pitchLetterOfSolfaNumber(solfaNumberOfPitchClass(pitchClass));

pitchLetterOfSolfaNumber2 = (solfaNum, keyPitchClass) => pitchLetterOfPitchClass(pitchClassOfSolfaNumber2(solfaNum, keyPitchClass));
pitchClassOfSolfaNumber2 = (solfaNum, keyPitchClass) => (12 + pitchClassOfSolfaNumber(solfaNum) - keyPitchClass) % 12;


toPitchClass = note => isValidNote(note) ? note % 12 : undefined;
toOctaveClass = note => isValidNote(note) ? Math.trunc(note / 12) : undefined;


fromPitchClass = (pitchClass, octaveClass = 5) => {
	if (isValidPitchClass(pitchClass) && isValidOctaveClass(octaveClass)) {
		return pitchClass + octaveClass * 12;
	}
};
fromPitchName = (pitchName, octaveClass = 5) => {

}


isValidPitchClass = pitchClass => (pitchClass & 15) < 12 && ((pitchClass >= 0 && pitchClass < 128) || (pitchClass >= 144 && pitchClass < 256));

isValidSolfaNumber = solfaNum => solfaNum > 0 && solfaNum < 8;
isValidAccidentalPitchClass = accPitchClass => Math.abs(accPitchClass) <= 3;
isValidOctaveValue = octaveValue => Math.abs(octaveValue) <= 7;
fromSolfaNumber3 = (solfaNum, accPitchClass = 0, octaveValue = 0) => {
	if (isValidSolfaNumber(solfaNum) && isValidAccidentalPitchClass(accPitchClass) && isValidOctaveValue(octaveValue)) {
		const rootPitchClass = solfaNum * 2 - (solfaNum > 3 ? 3 : 2),
			octavePitchClass = 128 + 16 * octaveValue;
		return rootPitchClass + accPitchClass + octavePitchClass
	} else {
		return -1;
	}
};
fromSolfaNumber = solfaNum => fromSolfaNumber3(solfaNum);
toSolfaNumber = pitchClass => {
	const rootPitchClass = pitchClass & 15;
	return rootPitchClass < 12 ? (rootPitchClass + (rootPitchClass >= 5 ? 3 : 2)) >>> 1 : -1;
};



isValidSolfaNotation = solfaStr => /^(#{0,3}}|b{0,3})[1-7][<>][2-7]?$/.test(solfaStr);
fromSolfaNotation = solfaStr => {
	let state = 0,
		rootPitchClass = -1,
		deltaPitchClass = 0,
		octaveClass = 0;
	const n = solfaStr.length;
	for (let i = 0; i < n; i++) {
		const c = solfaStr.charCodeAt(i);
		if (c >= 49 && c <= 55) { /* '1' - '7'  */
			if (state == 0) {
				state = 1;
				rootPitchClass = (c - 48) * 2 - (c > 51 ? 3 : 2);
			} else if (state == 2) {
				if (c == 49) return -1;
				state = 4;
				octaveClass = c - 48;
			} else if (state == 3) {
				if (c == 49) return -1;
				state = 4;
				octaveClass = 16 - (c - 48);
			} else {
				return -1;
			}
		} else if (c == 35) { /* '#'' */
			if (state != 0 || deltaPitchClass < 0 || deltaPitchClass > 2) return -1;
			++deltaPitchClass;
		} else if (c == 98) { /* 'b' */
			if (state != 0 || deltaPitchClass > 0 || deltaPitchClass < -2) return -1;
			--deltaPitchClass;
		} else if (c == 62) { /* '>' */
			if (state != 1) return -1;
			state = 2;
			octaveClass = 1;
		} else if (c == 60) { /* '<' */
			if (state != 1) return -1;
			state = 3;
			octaveClass = 15;
		} else {
			return -1;
		}
	}
	return rootPitchClass + deltaPitchClass + octaveClass * 16;
};
toSolfaNotation = pitchClass => toSolfaNotation2(pitchClass);
toSolfaNotation2 = (pitchClass, solfaNum) => {
	if (pitchClass < 0 || pitchClass > 255) return -1;
	const rootPitchClass = pitchClass & 15,
		octaveValue = pitchClass < 128 ? pitchClass >>> 4 : 16 - (pitchClass >>> 4);
	if (rootPitchClass > 11 || octaveValue > 7) return;
	if (solfaNum == null) {
		solfaNum = (rootPitchClass + (rootPitchClass > 4 ? 3 : 2)) >>> 1;
	}
	const hintRootPitchClass = solfaNum * 2 - (solfaNum > 3 ? 3 : 2),
		countAccidental = Math.abs(rootPitchClass - hintRootPitchClass);
	if (solfaNum == 0 || countAccidental > 3) return;
	const accidentalMark = (rootPitchClass > hintRootPitchClass ? "###" : "bbb").substring(0, countAccidental),
		octaveMark = octaveValue > 0 ? (pitchClass < 128 ? ">" : "<") + (octaveValue > 1 ? String(octaveValue) : "") : "";
	return accidentalMark + String(solfaNum) + octaveMark;
};

isValidPitchName = pitchName => /^[A-G]$/.test(pitchName);
fromPitchName = pitchName => {
	if (pitchName.length < 1) return -1;
	const c = pitchName.charCodeAt(0);
	if (c < 65 || c > 71) return -1;
	return c < 67 ? 9 + (c - 65) * 2 : c * 2 - (c > 69 ? 135 : 134);
};
toPitchName = (pitchClass, keyPitchName = "C") => {
	const rn = pitchClass & 15;

};
isValidPitchName = pitchName = /^(#{0,3}|b{0,3})[A-G](-[1-5]|[0-9])$/.test(pitchName);
fromPitchName = pitchName => {

}
fromMidiNote = midiNote => {
	if (midiNote >= 0) {
		if (midiNote < 60) {
			return (midiNote % 12) + (16 - Math.floor(midiNote / 12)) * 16;
		} else if (midiNote < 128) {
			const minus60 = midiNote - 60;
			return (minus60 % 12) + Math.floor(minus60 / 12) * 16;
		}
	}
	return -1;
};

noteSet = (maxNoteCount = 12) => polyphone => {
	const a = [];
	for (let i = 0, p = polyphone >>> 0; i < maxNoteCount; i++, p >>>= 1) {
		a.push(p & 1);
	}
	return a;
};
binaryString = (maxNoteCount = 12) => polyphone => (s => "0".repeat(maxNoteCount - s.length) + s)((polyphone >>> 0).toString(2));

pitchClassSet = (maxNoteCount = 12) => polyphone => {
	const pcsArray = [];
	for (let i = 0, p = polyphone >>> 0; i < maxNoteCount; i++, p >>>= 1) {
		if (p & 1) {
			pcsArray.push(i);
		}
	}
	return pcsArray;
};
intervalClassSet = (maxNoteCount = 12) => polyphone => {
	const icsArray = [];
	let first, last = first = -1;
	for (let i = 0, p = polyphone >>> 0; i < maxNoteCount; i++, p >>>= 1) {
		if (p & 1) {
			if (first < 0) first = last = i;
			else {
				icsArray.push(i - last);
				last = i;
			}
		}
	}
	if (last >= 0) {
		icsArray.push(maxNoteCount + first - last);
	}
	return icsArray;
};
fromPitchClassSet = pcsArray => {
	const n = pcsArray.length;
	let polyphone = 0;
	for (let i = 0; i < n; i++) {
		polyphone += 1 << pcsArray[i];
	}
	return polyphone;
};
fromIintervalClassSet = icsArray => {
	const n = icsArray.length;
	let polyphone = 0,
		p = 1;
	for (let i = 0; i < n; i++) {
		polyphone += p;
		p <<= icsArray[i];
	}
	return polyphone;
};
rotations = (maxNoteCount = 12) => polyphone => {
	const resultArray = [],
		icsArray = intervalClassSet(maxNoteCount)(polyphone),
		n = icsArray.length;
	for (let i = 0; i < n; i++) {
		let rotated = 0,
			p = 1;
		for (let j = 0; j < n; j++) {
			rotated += p;
			p <<= icsArray[(j + i) % n];
		}
		resultArray.push(rotated);
	}
	return resultArray;
};
transpositions = (maxNoteCount = 12) => polyphone => {
	const resultArray = [],
		pcsArray = pitchClassSet(maxNoteCount)(polyphone),
		n = pcsArray.length;
	for (let i = 0; i < maxNoteCount; i++) {
		let transposed = 0;
		for (let j = 0; j < n; j++) {
			transposed += 1 << ((pcsArray[j] + i) % maxNoteCount);
		}
		resultArray.push(transposed);
	}
	return resultArray;
};
validateScale = (maxNoteCount = 12) => (maxNoteCountLimit = 0, maxInterval = 4) => polyphone => {
	let first, last = first = -1,
		count = 0;
	for (let i = 0, p = polyphone >>> 0; i < maxNoteCount; i++, p >>>= 1) {
		if (p & 1) {
			if (first < 0) {
				if (i > 0) return false;
				first = last = i;
			} else {
				if (i - last > maxInterval) return false;
				last = i;
				++count;
			}
		}
	}
	if (first >= 0) {
		if (maxNoteCount + first - last > maxInterval) return false;
		++count;
	}
	return maxNoteCountLimit > 0 ? count == maxNoteCountLimit : count > 0;
};
primaryScale = (maxNoteCount = 12) => polyphone => Math.min.apply(null, transpositions(maxNoteCount)(polyphone));

solfegePcsArray = [0, 2, 4, 5, 7, 9, 11];
solfegeOf = (pitchClass, rootPosition, rootGroup = 0) => {
	const pitchGroup = Math.floor(pitchClass / 12),
		rootPitchClass = solfegePcsArray[rootPosition % 7],
		delta = pitchClass - rootPitchClass - rootGoup * 12;
	let prefix = "";
	if (delta != 0) {
		prefix = (delta >= 0 ? "#" : "b").repeat(Math.abs(delta));
	}
	return prefix + String(rootPosition + 1) + (">".repeat(pitchGroup));
};
solfeges = (maxNoteCount = 12) => polyphone => pitchClassSet(maxNoteCount)(polyphone).map(solfegeOf);

notes12 = noteSet(12);
bin12 = binaryString(12);
pcs12 = pitchClassSet(12);
ics12 = intervalClassSet(12);
scale7 = validateScale(12)(7);
fromPcs = fromPitchClassSet;
fromIcs = fromIintervalClassSet;
rot12 = rotations(12);
trans12 = transpositions(12);
primScale12 = primaryScale(12);
solfe12 = solfeges(12);