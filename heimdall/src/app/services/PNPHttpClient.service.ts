import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { PnPSpot } from "../models/PnPSpot";
import { Spot } from "../models/Spot";
import { Observable, map, mergeMap, of, throwError } from "rxjs";
import { CancellationToken } from "../models/CancellationToken";
import { FetchService } from "./FetchService";
import { SpotListBuilder } from "../models/SpotListBuilder";
import { SettingsKey, SettingsService } from "./SettingsService";

@Injectable({
	providedIn: "root",
})
export class PnPClientService {
	private _hasApiKey: boolean = false;
	public get hasApiKey(): boolean {
		return this._hasApiKey;
	}

	private _hasUserId: boolean = false;
	public get hasUserId(): boolean {
		return this._hasUserId;
	}

	private _phpBaseHref: string = environment.pnpBaseHref;

	private _pnpSubscription = {
		latestSpot: new Date("1970-01-01T00:00:00.000Z"),
	};

	private readonly _regionFilter = "^(?:VK|VL|VJ|ZL|ZZ)";

	public constructor(
		private _fetchSvc: FetchService,
		private _settingSvc: SettingsService
	) {
		this.monitorApiKeySetting();
	}

	//public transformPnPToSpotList(pnpSpots: PnPSpot[]): Spot[] {}

	public async getSpotList(): Promise<Spot[]> {
		//const data = await this.get<PnPSpot[]>("VK");
		const data = await this.get<PnPSpot[]>("ALL");

		return new SpotListBuilder()
			.setCallsignFilter(this._regionFilter)
			.setSorting("DESC")
			.buildFromPnPSpots(data);
	}

	/***
	 * Returns an observable of spots that will update every updateInterval minutes
	 * @param updateInterval - how often to check for new spots in minutes
	 * @param cancellationToken - a cancellation token to cancel the updating of spots
	 * @returns an observable of spots
	 */
	public subscribeToSpots(
		updateInterval?: number,
		cancellationToken?: CancellationToken
	): Observable<Spot[]> {
		updateInterval = updateInterval || 3;

		cancellationToken = cancellationToken || new CancellationToken();

		const obs = this._fetchSvc
			.pollJson<PnPSpot[]>(
				updateInterval,
				`${this._phpBaseHref}ALL`,
				{},
				cancellationToken
			)
			.pipe(
				map((pnpSpots) => {
					return new SpotListBuilder()
						.setCallsignFilter(this._regionFilter)
						.setSorting("DESC")
						.buildFromPnPSpots(pnpSpots);
				})
			);

		return obs;
	}

	public submitSpot(spot: Spot): Observable<PostResponse> {
		const postSpot = {
			actClass: spot.awardList.getAtIndex(0).award,
			actSite: spot.awardList.getAtIndex(0).siteId,
			mode: spot.mode,
			freq: spot.frequency,
			actCallsign: spot.callsign,
			comments: spot.comment,
			userID: this._settingSvc.get(SettingsKey.PNP_USERNAME),
			apiKey: this._settingSvc.get(SettingsKey.PNP_API_KEY),
		};

		return this._fetchSvc
			.postJson<PostResponse>(this._phpBaseHref + "SPOT", postSpot)
			.pipe(
				mergeMap((v) => {
					if (v.response.toLocaleLowerCase().includes("failure")) {
						return throwError(() => v);
					} else {
						return of(v);
					}
				})
			);
	}

	private async get<T>(suffix: string): Promise<T> {
		const request: RequestInit = {
			method: "GET",
			headers: {
				"Content-Type": "text/html; charset=UTF-8",
			},
		};

		const data = await this._fetchSvc.getJsonPromise<T>(
			this._phpBaseHref + suffix,
			request
		);

		return data;
	}

	private monitorApiKeySetting(): void {
		this._hasApiKey = this.settingHasKey(SettingsKey.PNP_API_KEY);
		this._hasUserId = this.settingHasKey(SettingsKey.PNP_USERNAME);

		this._settingSvc.settingUpdated.subscribe((key) => {
			switch (key) {
				case SettingsKey.PNP_API_KEY:
					this._hasApiKey = this.settingHasKey(SettingsKey.PNP_API_KEY);
					break;
				case SettingsKey.PNP_USERNAME:
					this._hasUserId = this.settingHasKey(SettingsKey.PNP_USERNAME);
					break;
			}
		});
	}

	private settingHasKey(key: SettingsKey): boolean {
		const value = this._settingSvc.get<string>(key);

		return value !== undefined && value.length > 0;
	}
}

export type PostResponse = {
	response: string;
};
