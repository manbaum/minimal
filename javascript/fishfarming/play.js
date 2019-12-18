prime = n => n < 3 ? G.of(2) : G.concat(G.of(2), G.iterate(i => i + 2)(3).takeWhile(i => i <= n).filter(i => (q => G.iterate(i => i + 2)(3).takeWhile(i => i <= q))(Math.sqrt(i)).every(j => i % j != 0)));

G = require("./generator");

watch = f => (begin => (_ => Date.now() - begin)(f()))(Date.now());
testn = n => f => G.nat(n).map(_ => watch(f)).reduce((a, b) => a + b) / n;
arrayEq = xs => ys => G.zip(xs, ys).every(a => a[0] == a[1]);
eq = x => y => x == y;
testEq = cmp => f1 => f2 => G.nat(4096).filter(i => !cmp(f1(i))(f2(i)));

d12a = n => Array.from(b12(n)).reverse();
d12 = n => { const a = []; for (let i = 0, p = 1; i < 12; i++, p <<= 1) a.push(n & p ? 1 : 0); return a; };
b12 = n => (s => "0".repeat(12 - s.length) + s)((n & 4095).toString(2));
pcs = n => G.from(b12(n)).fold((m, c, i) => c == "1" ? (m.unshift(11 - i), m) : m)([]);
nps = n => G.xfold((m, c, t, i) => c == "1" ? (m.unshift(t - 12 + i), [m, 12 - i]) : [m, t])([], 13)(b12(n));
isScale = n => /^0{0,3}(10{0,3}){6}1$/.test(b12(n));
fromNps = s => parseInt(s.reverse().map(i => "0".repeat(i - 1)).join("1") + "1", 2);
rotate = i => a => G.concat(G.from(a).drop(i), G.from(a).take(i)).toArray();
rotates = n => (s => G.nat(s.length).map(i => rotate(i)(s)))(intervalPattern(n)).map(fromIntervalPattern).toArray();

c2 = n => G.nat(n).flatMap(i => G.nat(i).map(j => [i, j]).toArray()).toArray();
c3 = n => G.nat(n).flatMap(i => G.nat(i).flatMap(j => G.nat(j).map(k => [i, j, k]).toArray()).toArray()).toArray();

marks = ["bb", "b", "", "#", "##"];
notes = [0, 2, 4, 5, 7, 9, 11];

rotate = a => 
rotates
intervals = a => a.reduce((m, i) => (m.splice(i, 0, 1), m), G.repeat(2).take(7 - a.length).toArray());
steps = a => G.from(a).take(6).scan((m, i) => m + i)(0).toArray();
scale = a => G.from(a).take(6).scan((m, i) => m + i)(0).map((j, i) => marks[j - notes[i] + 2] + String(i + 1)).toArray();

c2(6).map(intervals).map(scale).toArray();

 1  2  3  4  5  6  7
 1  2  3  4 #5  6  7
 0  2  4  5  8  9  11



1 b2  b3 b4 b5 b6  b7 Altered Dominant
1 b2  b3  4 b5 b6  b7 Locrian
1  2  b3  4 b5 b6  b7 Half-Diminished
1 b2  b3  4  5 b6  b7 Phrygian
1  2  b3  4  5 b6  b7 Aeolian or Hypoaeolian or Natural Minor
1  2   3  4  5 b6  b7 Mixolydian ♭6
1 b2  b3  4  5  6  b7 Phrygian ♯6 or Dorian ♭2
1  2  b3  4  5  6  b7 Dorian
1  2   3  4  5  6  b7 Mixolydian
1  2   3 #4  5  6  b7 Lydian Dominant or Acoustic or Overtone or Lydian ♭7
1 b2  b3  4  5  6   7
1  2  b3  4  5  6   7 Ascending Melodic Minor
1  2   3  4  5  6   7 Ionian
1  2   3 #4  5  6   7 Lydian
1  2   3 #4 #5  6   7 Lydian Augmented

1  2  b3  4  5 b6   7 Harmonic Minor or Aeolian ♯7
1 b2  b3  4 b5  6  b7 Locrian ♯6
1  2   3  4 #5  6   7 Ionian ♯5
1  2  b3 #4  5  6  b7 Ukrainian Dorian
1 b2   3  4  5 b6  b7 Phrygian Dominant
1 #2   3 #4  5  6   7 Lydian ♯2
1 b2  b3 b4 b5 b6 bb7 Altered Diminished
1 b2   3  4  5 b6   7 Double Harmonic or Byzantine or Arabic or Gypsy major or Flamenco or Major-Phrygian
1 #2   3 #4  5 #6   7 Lydian ♯2 ♯6
1 b2  b3 b4  5 b6 bb7 Phrygian ♭♭7 ♭4 or Ultraphrygian
1  2  b3 #4  5 b6   7 Hungarian Minor
1 b2   3  4 b5  6  b7 Locrian ♮6 ♮3 or Mixolydian ♭5 ♭2 or Oriental
1 #2   3  4 #5  6   7 Ionian ♯5 ♯2 or Ionian Augmented ♯2
1 b2 bb3  4 b5 b6 bb7 Locrian ♭♭3 ♭♭7
1 b2   3 #4 #5 #6   7 Enigmatic 
