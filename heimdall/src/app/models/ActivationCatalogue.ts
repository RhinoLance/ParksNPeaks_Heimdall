import { Observable, Subject } from "rxjs";
import { Activation } from "./Activation";
import { Spot } from "./Spot";

export class ActivationCatalogue {
	private _activationList: Activation[] = [];
	public get activations(): Activation[] {
		return this._activationList;
	}

	private _onUpdate = new Subject<Activation>();
	public get onUpdate() {
		return this._onUpdate as Observable<Activation>;
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

		if (spotAdded) {
			this._onUpdate.next(activation);
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
			(v) => v.callsign.root == spot.callsign.root
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
}
