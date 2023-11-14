export class Callsign {
	private _base: string = "";
	private _prefix: string = "";
	private _suffix: string = "";

	public get base(): string {
		return this._base;
	}

	public get prefix(): string {
		return this._prefix;
	}

	public get suffix(): string {
		return this._suffix;
	}

	constructor(public callsign: string) {
		this.extractParts(callsign);
	}

	public toString(): string {
		return this.callsign;
	}

	private extractParts(callsign: string) {
		const lc = callsign.toUpperCase();

		const regex =
			/^(?:([A-Z0-9]{1,3})\/)?([A-Z0-9]{4,})(?:\/([A-Z0-9]{1,3}))?$/;

		const matches = regex.exec(lc);

		if (matches) {
			this._prefix = matches[1] ?? "";
			this._base = matches[2];
			this._suffix = matches[3] ?? "";
		} else {
			throw `Invalid callsign: ${callsign}`;
		}
	}
}
