package test;

public class Fuck {

	private final String name;

	public Fuck(String name) {
		this.name = name;
	}

	public String toString() {
		return "Fuck " + name;
	}

	public String fuck(Super s, Fuck f1, Fuck f2) {
		return f1 + " and " + f2 + " the " + s.name + " all are shit! said by " + name + ".";
	}

	public abstract class Super {

		public final String name;

		protected Super(String name) {
			this.name = name;
		}

		public abstract String toString();

		public Fuck superer() {
			return Fuck.this;
		}
	}

	public class Shit extends Super {

		public Shit(String name) {
			(new Fuck("Fuck")).super(name);
		}

		public String toString() {
			return fuck(this, shiter(), superer());
		}

		public Fuck shiter() {
			return Fuck.this;
		}
	}

	public static abstract class Ultra {

		public abstract String toString();

		public class Junk extends Ultra {

			public final String name;

			public Junk(String name) {
				this.name = name;
			}

			public String toString() {
				return new Fuck(name).new Shit("Dogshit") {

					public String toString() {
						return "Wtf! " + super.toString();
					}
				}.toString();
			}
		}
	}

	public static class Oh {

		public class No extends Ultra {

			public String toString() {
				return "Ohhh Nooo";
			}

			public Junk junk() {
				return new Junk(toString());
			}
		}
	}

	public static class Foo extends Ultra {

		public String toString() {
			return "Foo";
		}

		public Junk junk() {
			return new Junk(toString());
		}
	}

	public static void main(String[] args) {
		Ultra.Junk j1 = new Foo().junk();
		System.out.println(j1.toString());
		Ultra.Junk j2 = new Oh().new No().junk();
		System.out.println(j2.toString());
		Shit s = new Fuck("You").new Shit("Bullshit");
		System.out.println(s.toString());
	}
}