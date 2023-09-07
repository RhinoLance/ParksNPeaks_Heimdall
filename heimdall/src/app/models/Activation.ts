import { Spot } from "./Spot";

import "../extensions/Date";
import { SpotType } from "./SpotType";

import commonSiteNamewords from "../../assets/data/commonSiteNameWords.json";
import { ActivationAwardList } from "./ActivationAwardList";
import { ReplaySubject, Subject } from "rxjs";
import { REMOVE_STYLES_ON_COMPONENT_DESTROY } from "@angular/platform-browser";

export class Activation {
	public awardList: ActivationAwardList = new ActivationAwardList();
	public siteName: string = "";
	public callsign: string = "";
	public callsignRoot: string = "";

	public onUpdate = new ReplaySubject<Spot>();

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
		this.addAwardIfRequired(spot);

		this.onUpdate.next(spot);
	}

	public getLatestSpot(): Spot {
		const sorted =
			this._spotList.length > 1
				? this.orderSpotsByTimeDesc(this._spotList).slice(0, 2)
				: this._spotList;

		const spots = this.updateSpotTypes(sorted);

		return spots[0];
	}

	public getSupersededSpots() {
		const spots = this._spotList
			.slice()
			.sort((a, b) => {
				return b.time.getTime() - a.time.getTime();
			})
			.slice(1);

		const updated = this.updateSpotTypes(spots);

		return updated;
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
					v.time.getTime() == spot.time.getTime() &&
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

	private orderSpotsByTimeDesc(spotList: Spot[]): Spot[] {
		return spotList.slice().sort((a, b) => {
			return b.time.getTime() - a.time.getTime();
		});
	}

	private updateSpotTypes(spotList: Spot[]): Spot[] {
		const output: Spot[] = [];

		spotList.map((spot) => {
			output.push(spot);

			const index = spotList.findIndex((v) => v.id == spot.id);

			//The spotList should already be sorted by time, with index 0 having he latest spot.

			//Is it the first spot of the activation?
			if (index == spotList.length - 1) {
				spot.type = SpotType.Spot;
				return;
			}

			const previousSpot = spotList[index + 1];
			spot.type =
				previousSpot.mode == spot.mode &&
				previousSpot.frequency == spot.frequency
					? SpotType.Respot
					: SpotType.Spot;
		});

		return output;
	}

	private addAwardIfRequired(spot: Spot): void {
		spot.awardList.toArray().map((v) => {
			if (!this.awardList.getAwards().includes(v.award)) {
				this.awardList.add(v);
			}
		});
	}
}
