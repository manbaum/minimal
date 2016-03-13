
"use strict"

const nZERO = f => x => x;
const nONE = f => x => f(x);
const nTWO = f => x => f(f(x));
const nTHREE = f => x => f(f(f(x)));

const INC = n => f => x => f(n(f)(x));
const ADD = m => n => n(INC)(m);
const MUL = m => n => n(ADD(m))(nZERO);
const POW = m => n => n(MUL(m))(nONE);

const nFIVE = ADD(nTWO)(nTHREE);
const nTEN = ADD(nFIVE)(nFIVE);
const nFIFTEEN = ADD(nFIVE)(nTEN);
const nHUNDRED = MUL(nTEN)(nTEN);

const bTRUE = x => y => x;
const bFALSE = x => y => y;

const IF = c => c;

const NOT = b => b(bFALSE)(bTRUE);
const AND = b => c => b(c)(bFALSE);
const OR = b => c => b(bTRUE)(c);
const XOR = b => c => b(c(bFALSE)(bTRUE))(c);
const EQV = b => c => b(c)(c(bFALSE)(bTRUE));
const NAND = b => c => b(c)(bFALSE)(bFALSE)(bTRUE);

const ISZERO = n => n(bTRUE(bFALSE))(bTRUE);

const PAIR = x => y => f => f(x)(y);
const LEFT = p => p(bTRUE);
const RIGHT = p => p(bFALSE);

const SLIDE = p => PAIR(RIGHT(p))(INC(RIGHT(p)));
const DEC = n => LEFT(n(SLIDE)(PAIR(nZERO)(nZERO)));
const SUB = m => n => n(DEC)(m);

const ISLESSOREQ = m => n => ISZERO(SUB(m)(n));
const ISGREATOREQ = m => n => ISZERO(SUB(n)(m));
const ISLESS = m => n => NOT(ISZERO(SUB(n)(m)));
const ISGREAT = m => n => NOT(ISZERO(SUB(m)(n)));
const ISEQ = m => n => AND(ISZERO(SUB(m)(n)))(ISZERO(SUB(n)(m)));
const ISNOTEQ = m => n => NOT(AND(ISZERO(SUB(m)(n)))(ISZERO(SUB(n)(m))));

const Y = f => (x => f(x(x)))(x => f(x(x)));
const Z = f => (x => f(y => x(x)(y)))(x => f(y => x(x)(y)));

const MOD = m => n => Z(f =>
	m => n => IF
		(ISLESS(m)(n))
		(m)
		(y => f
			(SUB(m)(n))
			(n)
			(y)))(m)(n);
const DIV = m => n => Z(f =>
	m => n => IF
		(ISLESS(m)(n))
		(nZERO)
		(INC(y => f
			(SUB(m)(n))
			(n)
			(y))))(m)(n);

const lEMPTY = PAIR(bTRUE)(bTRUE);

const ISEMPTY = l => LEFT(l);
const CONS = x => l => PAIR(bFALSE)(PAIR(x)(l));
const CAR = l => LEFT(RIGHT(l));
const CDR = l => RIGHT(RIGHT(l));
const FOLD = l => m => g => Z(f =>
	l => m => g => IF
		(ISEMPTY(l))
		(m)
		(g
			(y => f
				(CDR(l))
				(m)
				(g)
				(y))
			(CAR(l))))(l)(m)(g);
const LENGTH = l => FOLD(l)(nZERO)(m => x => INC(m));
const MAP = l => f => (FOLD
	(l)
	(lEMPTY)
	(m => x => CONS(f(x))(m)));
const PUSH = l => x => (FOLD
	(l)
	(CONS(x)(lEMPTY))
	(m => x => CONS(x)(m)));
const PICK = l => n => Z(f =>
	l => n => IF
		(ISZERO(n))
		(CAR(l))
		(y => f
			(CDR(l))
			(DEC(n))
			(y)))(l)(n);
const REVERSE = l => (FOLD
	(l)
	(lEMPTY)
	(m => x => PUSH(m)(x)));
const ZIP = a => b => Z(f =>
	a => b => IF
		(ISEMPTY(a))
		(lEMPTY)
		(IF
			(ISEMPTY(b))
			(lEMPTY)
			(CONS
				(PAIR(CAR(a))(CAR(b)))
				(y => f
					(CDR(a))
					(CDR(b))
					(y)))))(a)(b);

const RANGE = m => n => Z(f =>
	m => n => IF
		(ISGREAT(m)(n))
		(lEMPTY)
		(CONS
			(m)
			(y => f
				(INC(m))
				(n)
				(y))))(m)(n);

const cB = nTEN;
const cF = INC(cB);
const cI = INC(cF);
const cU = INC(cI);
const cZ = INC(cU);
const sFIZZ = CONS(cF)(CONS(cI)(CONS(cZ)(CONS(cZ)(lEMPTY))));
const sBUZZ = CONS(cB)(CONS(cU)(CONS(cZ)(CONS(cZ)(lEMPTY))));
const sFIZZBUZZ = CONS(cF)(CONS(cI)(CONS(cZ)(CONS(cZ)(sBUZZ))));

const DIGITS = n => Z(f =>
	n => PUSH
		(IF
			(ISLESS(n)(nTEN))
			(lEMPTY)
			(y => f
				(DIV(n)(nTEN))
				(y)))
		(MOD(n)(nTEN)))(n);


const SOLUTION =(MAP
	(RANGE(nONE)(nHUNDRED))
	(n => IF
		(ISZERO(MOD(n)(nFIFTEEN)))
		(sFIZZBUZZ)
		(IF
			(ISZERO(MOD(n)(nTHREE)))
			(sFIZZ)
			(IF
				(ISZERO(MOD(n)(nFIVE)))
				(sBUZZ)
				(DIGITS(n))))));

const toI = n => n(i => i + 1)(0);
const fmI = i => Z(f => i => i > 0 ? INC(y => f(i - 1)(y)) : nZERO)(i);
const toB = b => b(true)(false);
const toA = l => Z(f => l => toB(ISEMPTY(l)) ? y => [] : y => [CAR(l), ...f(CDR(l))(y)])(l)();
const fmA = a => a.reduce((m, x) => CONS(x)(m), lEMPTY);
const toC = c => "0123456789BFiuz".substr(toI(c), 1);
const toS = s => toA(s).map(toC).join("");

console.log(toA(SOLUTION).map(toS).join(", "));
