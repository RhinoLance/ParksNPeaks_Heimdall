import { PnPSpot } from "./PnPSpot";
import { Spot, SpotClass, SpotMode } from "./Spot";

export class SpotBuilder {
	private _pnpSpot: PnPSpot = new PnPSpot();

	public addPnpSpot(pnpSpot: PnPSpot): SpotBuilder {
		this._pnpSpot = pnpSpot;
		return this;
	}

	public build(): Spot {
		return this.createFromPnPSpot(this._pnpSpot);
	}

	private getModeIconAndColour(spot: Spot): [string, string, string] {
		let icon: string;
		let colour: string;
		const name: string = SpotMode[spot.mode];

		switch (spot.mode) {
			case SpotMode.AM:
				icon = "mdi-radio";
				colour = "#ff9f1c";
				break;
			case SpotMode.CW:
				icon = "mdi-dots-horizontal";
				colour = "#16425b";
				break;
			case SpotMode.DATA:
				icon = "mdi-memory";
				colour = "#fb8b24";
				break;
			case SpotMode.FM:
				icon = "mdi-radio-handheld";
				colour = "#2ec4b6";
				break;
			case SpotMode.SSB:
				icon = "mdi-waveform";
				colour = "#e71d36";
				break;
			default:
				icon = "radio";
				colour = "#f2e9e4";
				break;
		}

		return [name, icon, colour];
	}

	private getClassImage(spot: Spot): string {
		let image = "";

		switch (spot.class) {
			case SpotClass.BOTA:
				image = "assets/images/classLogo/BOTA.png";
				break;
			case SpotClass.POTA:
				image = "assets/images/classLogo/POTA.jpg";
				break;
			case SpotClass.VK_SOTA:
			case SpotClass.ZL_SOTA:
			case SpotClass.SOTA:
				image = "assets/images/classLogo/SOTA.svg";
				break;
			case SpotClass.VK_WWFF:
			case SpotClass.ZL_WWFF:
			case SpotClass.WWFF:
				image = "assets/images/classLogo/WWFF.png";
				break;
			default:
				image = "assets/images/classLogo/Other.png";
				break;
		}

		return image;
	}

	private createFromPnPSpot(pnpSpot: PnPSpot): Spot {
		const spot = new Spot();
		spot.altClass = SpotClass[pnpSpot.altClass as keyof typeof SpotClass];
		spot.callsign = pnpSpot.actCallsign;
		spot.callsignRoot = pnpSpot.actCallsign.split("/P")[0];
		spot.class = SpotClass[pnpSpot.actClass as keyof typeof SpotClass];
		spot.comment = pnpSpot.actComments;
		spot.frequency = pnpSpot.actFreq;
		spot.mode = SpotMode[pnpSpot.actMode as keyof typeof SpotMode];
		spot.siteId = pnpSpot.actSiteID;
		spot.spotter = pnpSpot.actSpoter;
		spot.time = new Date(pnpSpot.actTime);

		[spot.modeName, spot.modeIcon, spot.modeColour] =
			this.getModeIconAndColour(spot);
		spot.classImage = this.getClassImage(spot);

		if (pnpSpot.altLocation == "") {
			spot.location = pnpSpot.actSiteID;
			spot.altLocation = pnpSpot.actLocation;
		} else {
			spot.location = pnpSpot.actLocation;
			spot.altLocation = pnpSpot.altLocation;
		}

		spot.shortTime =
			spot.time.getHours().toString().padStart(2, "0") +
			":" +
			spot.time.getMinutes().toString().padStart(2, "0");

		return spot;
	}
}
