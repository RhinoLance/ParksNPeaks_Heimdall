import { Injectable } from "@angular/core";
import { ActivationCatalogue } from "../models/ActivationCatalogue";
import { Observable, Subject, tap, merge, bufferTime, filter } from "rxjs";
import { Activation } from "../models/Activation";
import { PnPApiService, PostResponse } from "./PnPApiService";
import { Spot } from "../models/Spot";
import { SettingsService } from "./SettingsService";
import { Site } from "../models/Site";
import { PotaApiService } from "./PotaApiService";
import { CallsignDetails } from "../models/CallsignDetails";
import { WwffApiService } from "./WwffApiService";
import { environment } from "src/environments/environment";
import { SotaApiService } from "./SotaApiService";
import { ISpotSource } from "./ISpotSource";
import { ZLotaApiService } from "./ZLotaApiService";

@Injectable({
	providedIn: "root",
})
export class DataService {
	public activationUpdated = new Subject<Activation[]>();

	private _activations: ActivationCatalogue = new ActivationCatalogue();
	public get activationCalalogue(): ActivationCatalogue {
		return this._activations;
	}

	private _siteCache = new Map<string, Promise<Site>>();

	public get canSpot(): boolean {
		return this._pnpApiSvc.hasApiKey && this._pnpApiSvc.hasUserId;
	}
	public get canUpdateCallsignDetails(): boolean {
		return this._pnpApiSvc.hasApiKey && this._pnpApiSvc.hasUserId;
	}

	public constructor(
		private _pnpApiSvc: PnPApiService,
		private _potaApiSvc: PotaApiService,
		private _settingsSvc: SettingsService,
		private _zlotaApiSvc: ZLotaApiService,
		private _wwffApiSvc: WwffApiService,
		private _sotaApiSvc: SotaApiService
	) {
		this.initSpotListener();
	}

	public getActivations(): Activation[] {
		return this._activations.activations;
	}

	public submitSpot(spot: Spot): Observable<PostResponse> {
		spot.time = new Date();
		spot.spotter = this._settingsSvc.getPnpUser().userName;

		return this._pnpApiSvc
			.submitSpot(spot)
			.pipe(tap(() => this._activations.addSpot(spot.clone())));
	}

	public getUserDetails(callsign: string) {
		return this._pnpApiSvc.getCallsignDetails(callsign);
	}

	public updateUserDetails(callsignDetails: CallsignDetails) {
		return this._pnpApiSvc.updateCallsignDetails(callsignDetails);
	}

	private initSpotListener(): void {
		const dataServiceList: ISpotSource[] = [
			this._sotaApiSvc,
			this._potaApiSvc,
			this._zlotaApiSvc,
			this._wwffApiSvc,
			this._pnpApiSvc,
		];

		merge(...dataServiceList.map((svc) => svc.subscribeToSpots()))
			.pipe(
				filter((spot) => {
					const spotAgeMinutes =
						(new Date().getTime() - new Date(spot.time).getTime()) / 60000;
					return spotAgeMinutes <= environment.maxSpotAgeMinutes;
				}),
				bufferTime(2000),
				filter((v) => v.length > 0)
			)
			.subscribe({
				next: (v) => {
					const updatedActivations = this._activations.addSpots(v);

					if (updatedActivations.length > 0) {
						this.activationUpdated.next(updatedActivations);
					}
				},
			});
	}
}
