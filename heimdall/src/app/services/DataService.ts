import { Injectable } from "@angular/core";
import { ActivationCatalogue } from "../models/ActivationCatalogue";
import { Subject } from "rxjs";
import { Activation } from "../models/Activation";
import { PnPClientService } from "./PNPHttpClient.service";

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

	private initPnpListener(): void {
		this._pnpApiSvc.subscribeToSpots().subscribe((v) => {
			const updatedActivations = this._activations.addSpots(v);
			this.activationUpdated.next(updatedActivations);
		});
	}
}
