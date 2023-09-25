import { Activation } from "./Activation";
import { Spot } from "./Spot";

export class ActivationCatalogue {
	private _activationList: Activation[] = [];

	public get activations(): Activation[] {
		return this._activationList;
	}

	public addSpot(spot: Spot): Activation | undefined {
		let activation = this.findActivation(spot);
		let spotAdded: boolean;

		if (activation) {
			spotAdded = activation.addSpot(spot);
		} else {
			activation = new Activation(spot);
			this._activationList.push(activation);
			spotAdded = true;
		}

		return spotAdded ? activation : undefined;
	}

	public addSpots(spots: Spot[]): Activation[] {
		const activations = spots.map((v) => {
			return this.addSpot(v);
		});

		return activations.filter((v) => v != undefined) as Activation[];
	}

	private findActivation(spot: Spot): Activation | null {
		const callSignActivations = this._activationList.filter(
			(v) => v.callsignRoot == spot.callsignRoot
		);

		let retVal = null;
		for (let cI = 0; cI < callSignActivations.length; cI++) {
			const activation = callSignActivations[cI];
			if (activation.isPartOfThisActivation(spot)) {
				retVal = activation;
				break;
			}
		}

		return retVal;
	}

	/*
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

	*/
}
