
var ZERO = f => x => x;
var ONE = f => x => f(x);
var TWO = f => x => f(f(x));
var toI = n => n(i => i + 1)(0);
var fromI = i => i > 0 ? f => x => f(fromI(i - 1)(f)(x)) : ZERO;

var TRUE = x => y => x;
var FALSE = x => y => y;
var NOT = b => b(FALSE)(TRUE);
var AND = b => c => b(c)(FALSE);
var OR = b => c => b(TRUE)(c);
var XOR = b => c => b(c(FALSE)(TRUE))(c);
var toB = b => b(true)(false);

var IF = b => b;
var ISZERO = n => n(TRUE(FALSE))(TRUE);

var PAIR = x => y => f => f(x)(y);
var LEFT = p => p(TRUE);
var RIGHT = p => p(FALSE);

var INC = n => f => x => f(n(f)(x));
var SLIDE = p => PAIR(RIGHT(p))(INC(RIGHT(p)));
var DEC = n => LEFT(n(SLIDE)(PAIR(ZERO)(ZERO)));

var ADD = m => n => n(INC)(m);
var SUB = m => n => n(DEC)(m);
var MUL = m => n => n(ADD(m))(ZERO);
var POW = m => n => n(MUL(m))(ONE);

var ISLESSOREQ = m => n => ISZERO(SUB(m)(n));

var Y = f => (x => f(x(x)))(x => f(x(x)));
var Z = f => (x => f(y => x(x)(y)))(x => f(y => x(x)(y)));

var MOD = Z(f => m => n => IF(ISLESSOREQ(n)(m))(x => f(SUB(m)(n))(n)(x))(m));
var DIV = Z(f => m => n => IF(ISLESSOREQ(n)(m))(x => INC(f(SUB(m)(n))(n))(x))(ZERO));

var EMPTY = PAIR(TRUE)(TRUE);
var ISEMPTY = LEFT;
var UNSHIFT = l => x => PAIR(FALSE)(PAIR(x)(l));
var FIRST = l => LEFT(RIGHT(l));
var REST = l => RIGHT(RIGHT(l));
var toA = l => toB(ISEMPTY(l)) ? [] : [FIRST(l), ...toA(REST(l))];
var fromA = a => a.length > 0 ? UNSHIFT(fromA(a.slice(1)))(a[0]) : EMPTY;

var RANGE = Z(f => m => n => IF(ISLESSOREQ(m)(n))(x => UNSHIFT(f(INC(m))(n))(m)(x))(EMPTY));

var FOLD = Z(f => l => x => g => IF(ISEMPTY(l))(x)(y => g(f(REST(l))(x)(g))(FIRST(l))(y)));
var MAP = k => f => FOLD(k)(EMPTY)(l => x => UNSHIFT(l)(f(x)));

var PUSH = l => x => FOLD(l)(UNSHIFT(EMPTY)(x))(UNSHIFT);

var THREE = INC(TWO);
var FOUR = INC(THREE);
var FIVE = INC(FOUR);
var NINE = ADD(FOUR)(FIVE);
var TEN = ADD(FIVE)(FIVE);
var FIFTEEN = ADD(FIVE)(TEN);
var HUNDRED = MUL(TEN)(TEN);

var B = TEN;
var F = INC(B);
var I = INC(F);
var U = INC(I);
var ZED = INC(U);
var FIZZ = UNSHIFT(UNSHIFT(UNSHIFT(UNSHIFT(EMPTY)(ZED))(ZED))(I))(F);
var BUZZ = UNSHIFT(UNSHIFT(UNSHIFT(UNSHIFT(EMPTY)(ZED))(ZED))(U))(B);
var FIZZBUZZ = UNSHIFT(UNSHIFT(UNSHIFT(UNSHIFT(BUZZ)(ZED))(ZED))(I))(F);

var toC = c => "0123456789BFiuz".substr(toI(c), 1);
var toS = s => toA(s).map(toC).join("");
var DIGITS = Z(f => n => PUSH(IF(ISLESSOREQ(n)(NINE))(EMPTY)(x => f(DIV(n)(TEN))(x)))(MOD(n)(TEN)));


var SOLUTION = MAP(RANGE(ONE)(HUNDRED))(n =>
	IF(ISZERO(MOD(n)(FIFTEEN)))(FIZZBUZZ)(
		IF(ISZERO(MOD(n)(THREE)))(FIZZ)(
			IF(ISZERO(MOD(n)(FIVE)))(BUZZ)(
				DIGITS(n)
			)
		)
	)
);

console.log(toA(SOLUTION).map(toS).join(", "));
