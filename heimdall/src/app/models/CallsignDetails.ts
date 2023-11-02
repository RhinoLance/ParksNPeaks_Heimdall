export class CallsignDetails {
	public constructor(
		public callsign: string,
		public name: string,
		public alsoKnownAs: string,
		public lastUpdated: Date
	) {}
}
