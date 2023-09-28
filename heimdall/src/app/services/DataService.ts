import { Injectable } from "@angular/core";
import { ActivationCatalogue } from "../models/ActivationCatalogue";
import { Observable, Subject, tap } from "rxjs";
import { Activation } from "../models/Activation";
import { PnPClientService, PostResponse } from "./PNPHttpClient.service";
import { Spot } from "../models/Spot";
import { SettingsKey, SettingsService } from "./SettingsService";

@Injectable({
	providedIn: "root",
})
export class DataService {
	public activationUpdated = new Subject<Activation[]>();

	private _activations: ActivationCatalogue = new ActivationCatalogue();

	public constructor(
		private _pnpApiSvc: PnPClientService,
		private _settingsSvc: SettingsService
	) {
		this.initPnpListener();
	}

	public getActivations(): Activation[] {
		return this._activations.activations;
	}

	public submitSpot(spot: Spot): Observable<PostResponse> {
		spot.time = new Date();
		spot.spotter = this._settingsSvc.get(SettingsKey.PNP_USERNAME) ?? "";

		return this._pnpApiSvc
			.submitSpot(spot)
			.pipe(tap(() => this._activations.addSpot(spot)));
	}

	private initPnpListener(): void {
		this._pnpApiSvc.subscribeToSpots().subscribe((v) => {
			const updatedActivations = this._activations.addSpots(v);
			this.activationUpdated.next(updatedActivations);
		});
	}
}
