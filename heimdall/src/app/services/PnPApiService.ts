import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { PnPSpot } from "../models/PnPSpot";
import { Spot } from "../models/Spot";
import { Observable, map, mergeMap, of, throwError } from "rxjs";
import { CancellationToken } from "../models/CancellationToken";
import { FetchService, TInit } from "./FetchService";
import { SpotListBuilder } from "../models/SpotListBuilder";
import { SettingsKey, SettingsService } from "./SettingsService";
import { PnPPark } from "../models/PnPPark";
import { PnPSummit } from "../models/PnPSummit";
import { CallsignDetails } from "../models/CallsignDetails";
import { PnPCallsign } from "../models/PnPCallsign";
import { CallsignDetailsConvertor } from "../models/CallsignDetailsConvertor";
import { pnpResponseToJSON, throwOnPnpResponseError } from "./PnPApiOperators";
import { ISpotSource } from "./ISpotSource";
import { DataSource } from "src/environments/TEnvironment";

@Injectable({
	providedIn: "root",
})
export class PnPApiService implements ISpotSource {
	private _hasApiKey: boolean = false;
	public get hasApiKey(): boolean {
		return this._hasApiKey;
	}

	private _hasUserId: boolean = false;
	public get hasUserId(): boolean {
		return this._hasUserId;
	}

	private _apiEnv = environment.spotSources.get(DataSource.PNP);

	private _pnpSubscription = {
		latestSpot: new Date("1970-01-01T00:00:00.000Z"),
	};

	public constructor(
		private _fetchSvc: FetchService,
		private _settingSvc: SettingsService
	) {
		this.monitorApiKeySetting();
	}

	//public transformPnPToSpotList(pnpSpots: PnPSpot[]): Spot[] {}

	public async getPark(scheme: string, parkId: string): Promise<PnPPark> {
		const data = await this.get<PnPPark[]>(`PARK/${scheme}/${parkId}`);

		return data[0];
	}

	public async getSummit(summitId: string): Promise<PnPSummit> {
		const data = await this.get<PnPSummit[]>(`SUMMIT/${summitId}`);

		return data[0];
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
	): Observable<Spot> {
		updateInterval = updateInterval || this._apiEnv.pollIntervalMinutes;

		cancellationToken = cancellationToken || new CancellationToken();

		const obs = this._fetchSvc
			.pollJson<PnPSpot[]>(
				updateInterval,
				`${this._apiEnv.baseHref}ALL`,
				{},
				cancellationToken
			)
			.pipe(
				map((pnpSpots) => {
					return new SpotListBuilder()
						.setCallsignFilter(this._apiEnv.siteFilter)
						.setSorting("DESC")
						.buildFromPnPSpots(pnpSpots);
				}),
				mergeMap((spots) => spots) // convert the array of spots into a stream of spots
			);

		return obs;
	}

	public submitSpot(spot: Spot): Observable<PostResponse> {
		const pnpUser = this._settingSvc.getPnpUser();

		const postSpot = {
			actClass: spot.awardList.getAtIndex(0).award,
			actSite: spot.awardList.getAtIndex(0).siteId,
			mode: spot.mode,
			freq: spot.frequency,
			actCallsign: spot.callsign.toString(),
			comments: spot.comment,
			userID: pnpUser.userName,
			apiKey: pnpUser.apiKey,
		};

		return this._fetchSvc
			.postJson<PostResponse>(this._apiEnv.baseHref + "SPOT", postSpot)
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

	public getCallsignDetails(
		callsign: string
	): Observable<CallsignDetails | undefined> {
		return this.getJson<(PnPCallsign | boolean)[]>(`CALLSIGN/${callsign}`).pipe(
			map((v) => {
				return v[0] == false
					? undefined
					: CallsignDetailsConvertor.fromPnPCallsign(v[0] as PnPCallsign);
			})
		);
	}

	public updateCallsignDetails(
		callsignDetails: CallsignDetails
	): Observable<boolean> {
		return this.getCallsignDetails(callsignDetails.callsign).pipe(
			mergeMap((v) => {
				const urlSuffix = v == undefined ? `CALLSIGN/ADD` : `CALLSIGN/EDIT`;

				const pnpUser = this._settingSvc.getPnpUser();

				const postData = {
					callSign: callsignDetails.callsign,
					name: callsignDetails.name,
					alsoKnownAs: callsignDetails.alsoKnownAs,
					userID: pnpUser.userName,
					APIKey: pnpUser.apiKey,
				};

				return this._fetchSvc.postJson<PostResponse>(
					this._apiEnv.baseHref + urlSuffix,
					postData
				);
			}),
			throwOnPnpResponseError(),
			map(() => {
				return true;
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
			this._apiEnv.baseHref + suffix,
			request
		);

		return data;
	}

	private getJson<T>(urlSuffix: string): Observable<T> {
		const request: TInit = {
			method: "GET",
			headers: {
				"Content-Type": "text/html; charset=UTF-8",
			},
			selector: (response: Response) => response.text(),
		};

		return this._fetchSvc
			.fetch<string>(this._apiEnv.baseHref + urlSuffix, request)
			.pipe(pnpResponseToJSON<T>());
	}

	private monitorApiKeySetting(): void {
		const setPnPUser = () => {
			const pnpUser = this._settingSvc.getPnpUser();

			this._hasApiKey = pnpUser.apiKey.length > 0;
			this._hasUserId = pnpUser.userName.length > 0;
		};

		setPnPUser();

		this._settingSvc.settingUpdated.subscribe((key) => {
			if (key == SettingsKey.PNP_USER) {
				setPnPUser();
			}
		});
	}
}

export type PostResponse = {
	response: string;
};

export type PnPUser = {
	userName: string;
	callsign: string;
	apiKey: string;
};
