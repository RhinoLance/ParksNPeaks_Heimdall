import { ActivationAward } from "./ActivationAward";
import { AwardScheme } from "./AwardScheme";
import { PnPSpot } from "./PnPSpot";
import { Spot } from "./Spot";
import { SpotMode } from "./SpotMode";
import { SpotType } from "./SpotType";

export class SpotBuilder {
	private _pnpSpot: PnPSpot | null = null;

	public addPnpSpot(pnpSpot: PnPSpot): SpotBuilder {
		this._pnpSpot = pnpSpot;
		return this;
	}

	public build(): Spot {
		if (this._pnpSpot == null) throw new Error("No PnPSpot to build from.");

		return this.createFromPnPSpot(this._pnpSpot);
	}

	private createFromPnPSpot(pnpSpot: PnPSpot): Spot {
		const spot = new Spot();
		spot.callsign = pnpSpot.actCallsign;
		spot.callsignRoot = pnpSpot.actCallsign.split("/P")[0];
		spot.frequency = Number(pnpSpot.actFreq);
		spot.mode = SpotMode[pnpSpot.actMode as keyof typeof SpotMode];
		spot.spotter = pnpSpot.actSpoter;
		spot.time = new Date(pnpSpot.actTime + "Z");
		spot.type = SpotType.NotSet;

		spot.awardList.add(...this.getAwardSchemes(pnpSpot));

		spot.siteName =
			pnpSpot.altLocation == "" ? pnpSpot.actLocation : pnpSpot.altLocation;

		spot.comment = this.stripSpotPublisherFromComment(pnpSpot.actComments);

		return spot;
	}

	private getAwardSchemes(pnpSpot: PnPSpot): ActivationAward[] {
		const retVal: ActivationAward[] = [
			new ActivationAward(
				AwardScheme[pnpSpot.actClass as keyof typeof AwardScheme],
				pnpSpot.actSiteID
			),
		];

		if (pnpSpot.altClass != "") {
			const altAward =
				AwardScheme[pnpSpot.altClass as keyof typeof AwardScheme];
			const altSiteId = this.getAltSiteId(pnpSpot, altAward);

			if (altSiteId != "") {
				retVal.push(new ActivationAward(altAward, altSiteId));
			}
		}

		return retVal;
	}

	private getAltSiteId(pnpSpot: PnPSpot, altAward: AwardScheme): string {
		switch (altAward) {
			case AwardScheme.VKFF:
				return pnpSpot.WWFFid;
			default:
				return "";
		}
	}

	private stripSpotPublisherFromComment(comment: string): string {
		const publishers = [
			"VK portalog",
			"[VK port-a-log]",
			"*[iPnP]",
			"SOTA Spotter",
		];

		for (const publisher of publishers) {
			comment = comment.replace(publisher, "");
		}

		return comment.trim();
	}
}
