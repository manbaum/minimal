"use strict"

const D = require("./property");
const U = require("./util");

const Tab = {};

D(Tab)
	.method({
		decomposeIndex(i) {
			const row = U.triRoot(i);
			const col = i - U.triNum(row);
			return [row, col];
		},
		composeIndex(row, col) {
			return row >= col ? U.triNum(row) + col : U.triNum(col) + row;
		},
		blockInfo(vs) {
			const numOfKinds = vs.length;
			const numOfBlocks = U.triNum(numOfKinds - 1);
			const blockTable = G.nat(numOfBlocks)
				.map(U.decomposeIndex)
				.group(p => p[0])
				.toGenerator()
				.scan(
					(m, ps) => {
						return ps.reduce(
							(m, p, i) => {
								const rows = vs[p[0] + 1],
									cols = vs[p[1]],
									blockSize = rows * cols;
								m.cols.push(cols);
								m.colSum.push(cols + (m.colSum.length > 0 ? m.colSum[m.colSum.length - 1] : 0));
								return {
									kind: p[0] + 1,
									rows,
									rowSum: m.rowSum + (i ? 0 : rows),
									cols: m.cols,
									colSum: m.colSum,
									blockSize: m.blockSize + blockSize,
									blockSum: m.blockSum + blockSize
								};
							}, {
								blockSize: 0,
								rowSum: m.rowSum,
								cols: [],
								colSum: [],
								blockSum: m.blockSum
							});
					}, {
						rowSum: 0,
						blockSum: 0
					})
				.toArray();
			return {
				numOfKinds,
				numOfBlocks,
				blockTable
			};
		},
		blockIndex(vs) {
			const {
				numOfKinds,
				numOfBlocks,
				blockTable
			} = U.blockInfo(vs);
			return D(i => {
				const b = blockTable.find(p => i < p.blockSum);
				const delta = i - blockTable[b.kind - 1].blockSum,
					{
						quot,
						rem
					} = U.div(delta, b.blockSize / b.rows);
				const row = quot + blockTable[b.kind - 1].rowSum,
					col = rem,
					rowKind = b.kind,
					colKind = b.colSum.findIndex(s => col < s);
				return {
					row,
					col,
					rowKind,
					rowIndex: quot,
					colKind,
					colIndex: rem - (colKind > 0 ? b.colSum[colKind - 1] : 0)
				};
			}, {
				numOfKinds,
				numOfBlocks,
				blockTable
			}, false);
		}
	});

module.exports = Tab;