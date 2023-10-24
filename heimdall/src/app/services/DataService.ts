import { Injectable } from "@angular/core";
import { ActivationCatalogue } from "../models/ActivationCatalogue";
import { Observable, Subject, tap } from "rxjs";
import { Activation } from "../models/Activation";
import { PnPClientService, PostResponse } from "./PNPHttpClient.service";
import { Spot } from "../models/Spot";
import { SettingsKey, SettingsService } from "./SettingsService";
import { ActivationAward } from "../models/ActivationAward";
import { AwardScheme } from "../models/AwardScheme";
import { Site } from "../models/Site";
import { SiteFactory } from "../models/SiteFactory";
import { PotaClientService } from "./PotaHttpClient.service";
import { ZLotaClientService } from "./ZLotaHttpClient";

@Injectable({
	providedIn: "root",
})
export class DataService {
	public activationUpdated = new Subject<Activation[]>();

	private _activations: ActivationCatalogue = new ActivationCatalogue();

	private _siteCache = new Map<string, Promise<Site>>();

	public constructor(
		private _pnpApiSvc: PnPClientService,
		private _potaApiSvc: PotaClientService,
		private _settingsSvc: SettingsService,
		private _zlotaApiSvc: ZLotaClientService
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
			.pipe(tap(() => this._activations.addSpot(spot.clone())));
	}

	public async getSiteDetails(award: ActivationAward): Promise<Site> {
		if (this._siteCache.has(award.siteId)) {
			return (await this._siteCache.get(award.siteId)) as Site;
		}

		let locationPromise: Promise<Site>;

		switch (award.award) {
			case AwardScheme.WWFF:
				locationPromise = this._pnpApiSvc
					.getPark(AwardScheme.WWFF, award.siteId)
					.then((v) => SiteFactory.fromPnPPark(v));
				break;
			case AwardScheme.SOTA:
				locationPromise = this._pnpApiSvc
					.getSummit(award.siteId)
					.then((v) => SiteFactory.fromPnPPeak(v));
				break;
			case AwardScheme.POTA:
				locationPromise = this._potaApiSvc
					.getPark(award.siteId)
					.then((v) => SiteFactory.fromPotaPark(v));
				break;
			case AwardScheme.ZLOTA:
				locationPromise = this._zlotaApiSvc
					.getSite(award.siteId)
					.then((v) => SiteFactory.fromZlotaSite(v));
				break;
			default:
				throw new Error("Unknown award type");
		}

		this._siteCache.set(award.siteId, locationPromise);
		return await locationPromise;
	}

	private initPnpListener(): void {
		this._pnpApiSvc.subscribeToSpots().subscribe((v) => {
			const updatedActivations = this._activations.addSpots(v);

			if (updatedActivations.length > 0) {
				this.activationUpdated.next(updatedActivations);
			}
		});
	}
}
