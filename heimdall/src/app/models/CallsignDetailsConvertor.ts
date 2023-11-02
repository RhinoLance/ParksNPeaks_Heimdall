import { PnPCallsign } from "./PnPCallsign";
import { CallsignDetails } from "./CallsignDetails";

export class CallsignDetailsConvertor {
	public static fromPnPCallsign(callsign: PnPCallsign): CallsignDetails {
		return new CallsignDetails(
			callsign.callSign,
			callsign.name,
			callsign.alsoKnownAs,
			new Date(callsign.lastUpdateDate.replace(" ", "T"))
		);
	}

	public static toPnPCallsign(callsign: CallsignDetails): PnPCallsign {
		return {
			callSign: callsign.callsign,
			name: callsign.name,
			alsoKnownAs: callsign.alsoKnownAs,
			lastDate: callsign.lastUpdated.toISOString(),
			lastUpdateDate: callsign.lastUpdated.toISOString(),
		};
	}
}
