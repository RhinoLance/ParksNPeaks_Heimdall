import { AwardScheme } from "./AwardScheme";
import { PnPSpot } from "./PnPSpot";
import { Spot } from "./Spot";
import { SpotMode } from "./SpotMode";
import { SpotType } from "./SpotType";

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

		switch (spot.award) {
			case AwardScheme.BOTA:
				image = "assets/images/classLogo/BOTA.png";
				break;
			case AwardScheme.POTA:
				image = "assets/images/classLogo/POTA.jpg";
				break;
			case AwardScheme.VK_SOTA:
			case AwardScheme.ZL_SOTA:
			case AwardScheme.SOTA:
				image = "assets/images/classLogo/SOTA.svg";
				break;
			case AwardScheme.VK_WWFF:
			case AwardScheme.ZL_WWFF:
			case AwardScheme.WWFF:
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
		spot.altAward = AwardScheme[pnpSpot.altClass as keyof typeof AwardScheme];
		spot.callsign = pnpSpot.actCallsign;
		spot.callsignRoot = pnpSpot.actCallsign.split("/P")[0];
		spot.award = AwardScheme[pnpSpot.actClass as keyof typeof AwardScheme];
		spot.comment = pnpSpot.actComments;
		spot.frequency = pnpSpot.actFreq;
		spot.mode = SpotMode[pnpSpot.actMode as keyof typeof SpotMode];
		spot.siteId = pnpSpot.actSiteID;
		spot.spotter = pnpSpot.actSpoter;
		spot.time = new Date(pnpSpot.actTime + "Z");
		spot.type = SpotType.NotSet;

		[spot.modeName, spot.modeIcon, spot.modeColour] =
			this.getModeIconAndColour(spot);
		spot.classImage = this.getClassImage(spot);

		if (pnpSpot.altLocation == "") {
			spot.siteId = pnpSpot.actSiteID;
			spot.siteName = pnpSpot.actLocation;
		} else {
			spot.siteId = pnpSpot.actLocation;
			spot.siteName = pnpSpot.altLocation;
		}

		spot.shortTime =
			spot.time.getHours().toString().padStart(2, "0") +
			":" +
			spot.time.getMinutes().toString().padStart(2, "0");

		return spot;
	}
}
