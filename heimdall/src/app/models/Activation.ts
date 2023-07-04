import { Spot } from "./Spot";

import "../extensions/Date";
import { AwardScheme } from "./AwardScheme";
import { SpotType } from "./SpotType";

import commonSiteNamewords from "../../assets/data/commonSiteNameWords.json";
import { ActivationAward } from "./ActivationAward";

export class Activation {
	public awardList: ActivationAward[] = [];
	public siteName: string = "";
	public callsign: string = "";
	public callsignRoot: string = "";

	private _spotList: Spot[] = [];

	public get awardCount(): number {
		return this.awardList.length;
	}

	public get spotCount(): number {
		return this._spotList.length;
	}

	public constructor(spot: Spot) {
		this.callsign = spot.callsign;
		this.callsignRoot = spot.callsignRoot;
		this.siteName = spot.siteName;
		this.addSpot(spot);
	}

	public addSpot(spot: Spot): void {
		this._spotList.push(spot);
		this.orderSpotsByTime();
		this.setSpotType(spot);
		this.addAwardIfRequired(spot);
	}

	public getLatestSpot(): Spot {
		return this._spotList[this.spotCount - 1];
	}

	public getSupersededSpots() {
		return this._spotList.slice(1, this.spotCount - 1);
	}

	public isPartOfThisActivation(spot: Spot): boolean {
		if (this.callsignRoot != spot.callsignRoot) {
			return false;
		}

		if (this.hasDifferentSiteIdForSameAwardScheme(spot)) {
			return false;
		}

		if (this.hasMatchingSite(spot)) {
			return true;
		}

		if (this.hasMatchingSpot(spot)) {
			return true;
		}

		return false;
	}

	private hasDifferentSiteIdForSameAwardScheme(spot: Spot): boolean {
		return (
			this.awardList.filter(
				(v) => v.award == spot.award && v.siteId != spot.siteId
			).length > 0
		);
	}

	private hasMatchingSite(spot: Spot): boolean {
		return this.awardList.filter((v) => v.siteId == spot.siteId).length > 0;
	}

	private hasMatchingSpot(spot: Spot): boolean {
		let retVal = false;
		const spotWords = this.extractIdentifyingLocationWords(spot);

		for (let cI = 0; cI < this._spotList.length; cI++) {
			const testSpot = this._spotList[cI];

			//Is beyond 30 minutes of this spot, assume not related
			if (spot.time.subtractAbs(testSpot.time) / 1000 / 60 > 30) {
				continue;
			}

			//Is within 5 minutes of this spot, assume related
			if (spot.time.subtractAbs(testSpot.time) / 1000 / 60 <= 5) {
				retVal = true;
				break;
			}

			//check if the location descriptions suggests it's the place
			const testWords = this.extractIdentifyingLocationWords(testSpot);
			if (testWords.filter((v) => spotWords.indexOf(v) > -1).length > 0) {
				retVal = true;
				break;
			}
		}

		return retVal;
	}

	private extractIdentifyingLocationWords(spot: Spot): string[] {
		const words = spot.siteName
			.split(" ")
			.filter((v) => commonSiteNamewords.indexOf(v.toLowerCase()) == -1);

		return words;
	}

	private orderSpotsByTime(): void {
		this._spotList.sort((a, b) => {
			return a.time.getTime() - b.time.getTime();
		});
	}

	private setSpotType(spot: Spot): void {
		const index = this._spotList.findIndex((v) => v.id == spot.id);

		if (index > 0) {
			const previousSpot = this._spotList[index - 1];
			spot.type =
				previousSpot.mode == spot.mode &&
				previousSpot.frequency == spot.frequency
					? SpotType.Respot
					: SpotType.Spot;
		} else {
			spot.type = SpotType.Spot;
		}
	}

	private addAwardIfRequired(spot: Spot): void {
		if (this.awardList.filter((v) => v.award == spot.award).length === 0) {
			this.awardList.push(new ActivationAward(spot.award, spot.siteId));
		}
	}
}


