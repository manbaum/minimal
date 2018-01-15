"use strict"

const D = require("./property");

const U = {};

const combiTCO = (n, k, mul, div) => {
	if (k == 1) {
		return n * mul / div;
	} else {
		return combiTCO(n - 1, k - 1, mul * n, div * k);
	}
};
const permuTCO = (n, k, mul) => {
	if (k == 0) {
		return mul;
	} else {
		return permuTCO(n - 1, k - 1, mul * n);
	}
};

D(U)
	.method({
		// Get both quotient and reminder of division of integers.
		div(dividend, divisor) {
			const quot = Math.trunc(dividend / divisor),
				rem = dividend - quot * divisor;
			return [quot, rem];
		},
		// https://en.wikipedia.org/wiki/Diagonal
		// https://oeis.org/A000096 The number of diagonals of an n-gon.
		// Seq: 0, 2, 5, 9, 14, 20, 27, 35, 44, 54, 65, 77, 90, 104, 119, 135, ...
		diagnum(n) {
			return n * (n + 3) / 2;
		},
		// https://en.wikipedia.org/wiki/Triangular_number
		// https://oeis.org/A000217 Triangular numbers
		// Seq: 0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, ...
		trinum(n) {
			return n * (n + 1) / 2;
		},
		// https://en.wikipedia.org/wiki/Triangular_number#Triangular_roots_and_tests_for_triangular_numbers
		// a(n) = floor((sqrt(8 * x + 1) - 1) / 2) - 1
		// https://oeis.org/A003056 Integer n appears n+1 times.
		// Seq: 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, ...
		triroot(n) {
			return Math.trunc(Math.sqrt(2 * n + 2) - 0.5);
		},
		// https://en.wikipedia.org/wiki/Combination
		// C(n, k) = n! / k! / (n - k)!
		// C(n, k) = C(n - 1, k - 1) + C(n - 1, k)
		combi(n = 1, k = 2) {
			if (k == 0) {
				return 1;
			} else if (k > n / 2) {
				return combiTCO(n, n - k, 1, 1);
			} else {
				return combiTCO(n, k, 1, 1);
			}
		},
		// https://en.wikipedia.org/wiki/Permutation
		// P(n, k) = n! / (n - k)!
		permu(n = 1, k = n) {
			if (n < k) {
				return 0;
			} else {
				return permuTCO(n, k, 1);
			}
		}
	});

module.exports = U;