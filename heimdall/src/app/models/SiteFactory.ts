import { PnPPark } from "./PnPPark";
import { PnPSummit } from "./PnPSummit";
import { PotaPark } from "./PotaPark";
import { Site } from "./Site";

export class SiteFactory {
	public static fromPnPPark(park: PnPPark): Site {
		return new Site(parseFloat(park.Latitude), parseFloat(park.Longitude));
	}

	public static fromPnPPeak(park: PnPSummit): Site {
		return new Site(parseFloat(park.Latitude), parseFloat(park.Longitude));
	}

	public static fromPotaPark(park: PotaPark): Site {
		return new Site(park.latitude, park.longitude);
	}
}
