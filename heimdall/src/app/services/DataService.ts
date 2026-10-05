import { Injectable } from "@angular/core";
import { ActivationCatalogue } from "../models/ActivationCatalogue";
import { Observable, Subject, tap, merge, bufferTime, filter, of } from "rxjs";
import { Activation } from "../models/Activation";
import { PnPApiService } from "./PnPApiService";
import { Spot } from "../models/Spot";
import { SettingsService } from "./SettingsService";
import { Site } from "../models/Site";
import { PotaApiService } from "./PotaApiService";
import { CallsignDetails } from "../models/CallsignDetails";
import { WwffApiService } from "./WwffApiService";
import { environment } from "src/environments/environment";
import { SotaApiService } from "./SotaApiService";
import { ISpotSource, PostResponse } from "./ISpotSource";
import { ZLotaApiService } from "./ZLotaApiService";
import { DataSource } from "src/environments/IEnvironment";
import { FetchService } from "./FetchService";

@Injectable({
	providedIn: "root",
})
export class DataService {
	public activationUpdated = new Subject<Activation[]>();

	private _activations: ActivationCatalogue = new ActivationCatalogue();
	private _dataServiceList = new Map<DataSource, ISpotSource>();
	public get activationCalalogue(): ActivationCatalogue {
		return this._activations;
	}

	private _siteCache = new Map<string, Promise<Site>>();

	public get canSpot(): boolean {
		return false;
	}
	public get canUpdateCallsignDetails(): boolean {
		return false;
	}

	public constructor(
		private _settingsSvc: SettingsService,
		private _fetchSvc: FetchService
	) {
		this.initSpotListener();
	}

	public getActivations(): Activation[] {
		return this._activations.activations;
	}

	public submitSpot(spot: Spot): Observable<PostResponse> {
		const pnpApiSvc = this._dataServiceList.get(
			DataSource.PNP
		) as unknown as PnPApiService;

		if (!pnpApiSvc) {
			return of();
		}

		spot.time = new Date();
		spot.spotter = this._settingsSvc.getPnpUser().userName;

		return pnpApiSvc
			.submitSpot(spot)
			.pipe(tap(() => this._activations.addSpot(spot.clone())));
	}

	public getUserDetails(callsign: string): Observable<CallsignDetails> {
		const pnpApiSvc = this._dataServiceList.get(
			DataSource.PNP
		) as unknown as PnPApiService;

		if (!pnpApiSvc) {
			return of(new CallsignDetails("Unknown", "Unknown", "", new Date()));
		}

		return pnpApiSvc.getCallsignDetails(callsign);
	}

	public updateUserDetails(callsignDetails: CallsignDetails) {
		const pnpApiSvc = this._dataServiceList.get(
			DataSource.PNP
		) as unknown as PnPApiService;

		if (!pnpApiSvc) {
			return of(false);
		}

		return pnpApiSvc.updateCallsignDetails(callsignDetails);
	}

	private initSpotListener(): void {
		if (environment.spotSources.has(DataSource.WWFF))
			this._dataServiceList.set(
				DataSource.WWFF,
				new WwffApiService(this._fetchSvc)
			);

		if (environment.spotSources.has(DataSource.SOTA))
			this._dataServiceList.set(
				DataSource.SOTA,
				new SotaApiService(this._fetchSvc)
			);

		if (environment.spotSources.has(DataSource.POTA))
			this._dataServiceList.set(
				DataSource.POTA,
				new PotaApiService(this._fetchSvc)
			);

		if (environment.spotSources.has(DataSource.ZLOTA))
			this._dataServiceList.set(
				DataSource.WWFF,
				new ZLotaApiService(this._fetchSvc)
			);

		if (environment.spotSources.has(DataSource.PNP))
			this._dataServiceList.set(
				DataSource.PNP,
				new PnPApiService(this._fetchSvc, this._settingsSvc)
			);

		merge(
			...Array.from(this._dataServiceList.values()).map((svc) =>
				svc.subscribeToSpots()
			)
		)
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
