export class Spot {
	public altClass: SpotClass = SpotClass.Other;
	public altLocation: string = '';
	public callsign: string = '';
	public class: SpotClass = SpotClass.Other;
	public comment: string = '';
	public frequency: number = 0;
	public location: string = '';
	public mode: SpotMode = SpotMode.Other;
	public siteId: string = '';
	public spotter: string = '';
	public time: Date = new Date();
}

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

	static toSpot(pnpSpot: PnPSpot): Spot {
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

export enum SpotMode {
	SSB,
	CW,
	FM,
	AM,
	DATA,
	Other,
}

export enum SpotClass {
	BOTA,
	DXCluster,
	HEMA,
	ILLW,
	IOTA,
	JOTA,
	KRNMPA,
	Other,
	POTA,
	QRP,
	SANPCPA,
	SiOTA,
	SOTA,
	WWFF,
	VK_Shires,
	VK_SOTA,
	VK_WWFF,
	ZL_OTA,
	ZL_SOTA,
	ZL_WWFF,
}
