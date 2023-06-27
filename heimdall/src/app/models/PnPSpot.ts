import { Spot, SpotClass, SpotMode } from "./Spot";

export class PnPSpot {
	public altClass: string = '';
	public altLocation: string = '';
	public actCallsign: string = '';
	public actClass: string = '';
	public actComments: string = '';
	public actFreq: number = 0;
	public actLocation: string = '';
	public actMode: string = '';
	public actSiteID: string = '';
	public actSpoter: string = '';
	public actTime: string = '';

	public static toSpot(pnpSpot: PnPSpot): Spot {
		const spot = new Spot();
		spot.altClass = SpotClass[pnpSpot.altClass as keyof typeof SpotClass];
		spot.altLocation = pnpSpot.altLocation;
		spot.callsign = pnpSpot.actCallsign;
		spot.class = SpotClass[pnpSpot.actClass as keyof typeof SpotClass];
		spot.comment = pnpSpot.actComments;
		spot.frequency = pnpSpot.actFreq;
		spot.location = pnpSpot.actLocation;
		spot.mode = SpotMode[pnpSpot.actMode as keyof typeof SpotMode];
		spot.siteId = pnpSpot.actSiteID;
		spot.spotter = pnpSpot.actSpoter;
		spot.time = new Date(pnpSpot.actTime);

		return spot;
	}
}