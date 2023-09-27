import { Injectable } from "@angular/core";
import { ActivationCatalogue } from "../models/ActivationCatalogue";
import { Observable, Subject } from "rxjs";
import { Activation } from "../models/Activation";
import { PnPClientService } from "./PNPHttpClient.service";
import { Spot } from "../models/Spot";

@Injectable({
	providedIn: "root",
})
export class DataService {
	public activationUpdated = new Subject<Activation[]>();

	private _activations: ActivationCatalogue = new ActivationCatalogue();

	public constructor(private _pnpApiSvc: PnPClientService) {
		this.initPnpListener();
	}

	public getActivations(): Activation[] {
		return this._activations.activations;
	}

	public submitSpot(spot: Spot): Observable<void> {
		return this._pnpApiSvc.submitSpot(spot);
	}

	private initPnpListener(): void {
		this._pnpApiSvc.subscribeToSpots().subscribe((v) => {
			const updatedActivations = this._activations.addSpots(v);
			this.activationUpdated.next(updatedActivations);
		});
	}
}
