import { Spot, SpotType } from "./Spot";

export class SpotCatalogue {
	private _spotCatalogue: Map<string, Spot[]>;

	public constructor() {
		this._spotCatalogue = new Map<string, Spot[]>();
	}

	public addSpots(spotList: Spot[]): void {
		spotList.map((spot) => {
			const key = spot.callsignRoot + spot.siteId;

			const value = this._spotCatalogue.get(key) ?? [];

			value.push(spot);

			this._spotCatalogue.set(key, value);
		});

		this.setSpotOrder();
		this.setSpotTypes();
	}

	private setSpotOrder(): void {
		this._spotCatalogue.forEach((spotList, _) => {
			this.orderSpotsByTimeDesc(spotList);
		});
	}

	private orderSpotsByTimeDesc(spotList: Spot[]): void {
		spotList.sort((a, b) => {
			return b.time.getTime() - a.time.getTime();
		});
	}

	private setSpotTypes(): void {
		const getSpotKey = (spot: Spot) => spot.frequency + spot.mode;

		this._spotCatalogue.forEach((spotList, _) => {
			let lastKey = getSpotKey(spotList[0]);

			for (let cI = 0; cI < spotList.length; cI++) {
				if (cI == 0) {
					spotList[cI].type = SpotType.New;
					spotList[cI].subSpotCount = spotList.length - 1;
				} else {
					const currentKey = getSpotKey(spotList[cI]);

					if (currentKey == lastKey) {
						spotList[cI].type = SpotType.Respot;
					} else {
						spotList[cI].type = SpotType.Spot;
						lastKey = currentKey;
					}
				}
			}
		});
	}

	public getCurrentSpots(): Spot[] {
		const outputList: Spot[] = [];

		this._spotCatalogue.forEach((spotList, _) => {
			spotList.map((spot) => {
				if (spot.type == SpotType.New) {
					outputList.push(spot);
				}
			});
		});

		this.orderSpotsByTimeDesc(outputList);

		return outputList;
	}

	public getSubSpots(spot: Spot): Spot[] {
		if (spot.subSpotCount == 0) {
			return [];
		}

		const key = spot.callsignRoot + spot.siteId;
		const spotList = this._spotCatalogue.get(key);

		if (spotList == undefined) {
			return [];
		}

		const outputList: Spot[] = [];

		for (let cI = 1; cI < spotList.length; cI++) {
			outputList.push(spotList[cI]);
		}

		return outputList;
	}

	public getSpots(): Spot[] {
		const outputList: Spot[] = [];

		this._spotCatalogue.forEach((spotList, _) => {
			spotList.map((spot) => {
				outputList.push(spot);
			});
		});

		this.orderSpotsByTimeDesc(outputList);

		return outputList;
	}
}
