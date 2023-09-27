import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { PnPSpot } from "../models/PnPSpot";
import { Spot } from "../models/Spot";
import { Observable, map } from "rxjs";
import { CancellationToken } from "../models/CancellationToken";
import { FetchService } from "./FetchService";
import { SpotListBuilder } from "../models/SpotListBuilder";
import { SettingsKey, SettingsService } from "./SettingsService";

@Injectable({
	providedIn: "root",
})
export class PnPClientService {
	private _phpBaseHref: string = environment.pnpBaseHref;

	private _pnpSubscription = {
		latestSpot: new Date("1970-01-01T00:00:00.000Z"),
	};

	private readonly _regionFilter = "^(?:VK|VL|VJ|ZL|ZZ)";

	public constructor(
		private _fetchSvc: FetchService,
		private _settingSvc: SettingsService
	) {}

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

	public submitSpot(spot: Spot): Observable<void> {
		const postSpot = {
			actClass: spot.awardList.getAtIndex(0).award,
			actSite: spot.awardList.getAtIndex(0).siteId,
			mode: spot.mode,
			freq: spot.frequency,
			actCallsign: spot.callsign,
			comments: spot.comment,
			userId: this._settingSvc.get(SettingsKey.CALLSIGN),
			APIKey: this._settingSvc.get(SettingsKey.PNP_API_KEY),
		};

		return this._fetchSvc.postJson<void>(this._phpBaseHref + "SPOT", postSpot);
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
}
