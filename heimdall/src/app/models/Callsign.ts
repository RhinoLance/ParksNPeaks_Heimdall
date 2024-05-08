export class Callsign {
	private _root: string = "";
	private _prefix: string = "";
	private _suffix: string = "";

	public get root(): string {
		return this._root;
	}

	public get prefix(): string {
		return this._prefix;
	}

	public get suffix(): string {
		return this._suffix;
	}

	public constructor(public callsign: string) {
		if (callsign == "") return;

		try{
			this.extractParts(callsign);
		}
		catch (e) {
			this._root = callsign;
		}
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
			this._root = matches[2];
			this._suffix = matches[3] ?? "";
		} else {
			throw `Invalid callsign: ${callsign}`;
		}
	}
}
