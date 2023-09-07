import { Spot } from "./Spot";

import "../extensions/Date";
import { SpotType } from "./SpotType";

import commonSiteNamewords from "../../assets/data/commonSiteNameWords.json";
import { ActivationAwardList } from "./ActivationAwardList";
import { Subject } from "rxjs";

export class Activation {
	public awardList: ActivationAwardList = new ActivationAwardList();
	public siteName: string = "";
	public callsign: string = "";
	public callsignRoot: string = "";

	public onUpdate = new Subject<Spot>();

	private _spotList: Spot[] = [];

	public get spots(): Spot[] {
		return this._spotList;
	}

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
		if (this.containsDuplicateSpot(spot)) {
			return;
		}

		this._spotList.push(spot);
		this.orderSpotsByTime();
		this.setSpotType(spot);
		this.addAwardIfRequired(spot);

		this.onUpdate.next(spot);
	}

	public getLatestSpot(): Spot {
		return this._spotList[0];
	}

	public getSupersededSpots() {
		return this._spotList.slice(1, this.spotCount);
	}

	public isPartOfThisActivation(spot: Spot): boolean {
		if (this.callsignRoot != spot.callsignRoot) {
			return false;
		}

		if (
			this.awardList.containsDifferentSiteIdForSameAwardScheme(
				...spot.awardList.toArray()
			)
		) {
			return false;
		}

		if (this.hasMatchingSiteId(spot)) {
			return true;
		}

		if (this.hasMatchingSpot(spot)) {
			return true;
		}

		return false;
	}

	public containsDuplicateSpot(spot: Spot): boolean {
		return (
			this._spotList.filter(
				(v) =>
					v.callsign == spot.callsign &&
					v.time == spot.time &&
					v.spotter == spot.spotter
			).length > 0
		);
	}

	private hasMatchingSiteId(spot: Spot): boolean {
		return this.awardList.containsSiteId(...spot.awardList.getSiteIds());
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
			return b.time.getTime() - a.time.getTime();
		});
	}

	private setSpotType(spot: Spot): void {
		const index = this._spotList.findIndex((v) => v.id == spot.id);

		//The spotList should already be sorted by time, with index 0 having he latest spot.

		//Is it the earliest spot of the activation?
		if (index == this._spotList.length - 1) {
			spot.type = SpotType.Spot;
			return;
		}

		const previousSpot = this._spotList[index + 1];
		spot.type =
			previousSpot.mode == spot.mode && previousSpot.frequency == spot.frequency
				? SpotType.Respot
				: SpotType.Spot;
	}

	private addAwardIfRequired(spot: Spot): void {
		spot.awardList.toArray().map((v) => {
			if (!this.awardList.getAwards().includes(v.award)) {
				this.awardList.add(v);
			}
		});
	}
}
