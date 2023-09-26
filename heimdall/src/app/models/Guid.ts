export class Guid {
	private static _validator = new RegExp(
		"^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$",
		"i"
	);
	public _value: string;

	private static EMPTY = "00000000-0000-0000-0000-000000000000";

	public constructor(guid: string) {
		if (!guid) throw new TypeError("Invalid argument; `value` has no value.");

		this._value = Guid.EMPTY;

		if (guid) {
			this._value = guid.toString();
		}
	}

	public equals(other: string) {
		// Comparing string `value` against provided `guid` will auto-call
		// toString on `guid` for comparison
		return Guid.isGuid(other) && this._value == other;
	}

	public isEmpty() {
		return this._value === Guid.EMPTY;
	}

	public toString() {
		return this._value;
	}

	public toJSON() {
		return this._value;
	}

	private static gen(count: number) {
		let out = "";
		for (let i = 0; i < count; i++) {
			out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		return out;
	}

	public static isGuid(value: string | Guid) {
		return (
			value && (value instanceof Guid || Guid._validator.test(value.toString()))
		);
	}

	public static create() {
		return new Guid(
			[Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join(
				"-"
			)
		);
	}

	public static Empty() {
		return new Guid(Guid.EMPTY);
	}

	public static raw = function () {
		return [
			Guid.gen(2),
			Guid.gen(1),
			Guid.gen(1),
			Guid.gen(1),
			Guid.gen(3),
		].join("-");
	};
}
