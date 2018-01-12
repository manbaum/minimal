
const BinTree = class {
	show() {
		throw new Error("n/a");
	}
	invert() {
		throw new Error("n/a");
	}
};

const Empty = new class extends BinTree {
	show() {
		return "";
	}
	invert() {
		return this;
	}
};

const Leaf = class extends BinTree {
	constructor(value) {
		super();
		this.value = value;
	}
	show() {
		return `Leaf ${this.value}`;
	}
	invert() {
		return this;
	}
};
const leaf = (value) => new Leaf(value);

const Fork = class extends BinTree {
	constructor(value, left, right) {
		super();
		this.value = value;
		this.left = left || Empty;
		this.right = right || Empty;
	}
	show() {
		return `Fork ${this.value} (${this.left.show()}) (${this.right.show()})`;
	}
	invert() {
		return new Fork(this.value, this.right.invert(), this.left.invert());
	}
};
const fork = (value, left, right) => new Fork(value, left, right);

const main = () => {
	const t = fork(4, fork(2, leaf(1), leaf(3)), fork(7, leaf(6), fork(9)));
	[t, t.invert()].map(x => console.log(x.show()));
};
main();
