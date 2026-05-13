import { Injectable } from "@angular/core";
import { ISpotSource } from "./ISpotSource";
import { environment } from "src/environments/environment";
import { parseSpotMode } from "../models/SpotMode";
import { CancellationToken } from "../models/CancellationToken";
import { Spot } from "../models/Spot";
import { catchError, filter, map, mergeMap, Observable, of } from "rxjs";
import { FetchService } from "./FetchService";
import { Callsign } from "../models/Callsign";
import { ActivationAward } from "../models/ActivationAward";
import { AwardScheme } from "../models/AwardScheme";
import { DataSource } from "src/environments/TEnvironment";

@Injectable({
	providedIn: "root",
})
export class SotaApiService implements ISpotSource {
	private _numberOfSpotsToFetch = 30;

	private _apiEnv = environment.spotSources.get(DataSource.SOTA);
	private _epochEndpoint = `${this._apiEnv.baseHref}spots/epoch/`;
	private _spotsEndpoint =
		`${this._apiEnv.baseHref}spots/` + `${this._numberOfSpotsToFetch}/all/all/`;

	private _lastFetchedSpotTime: string = "1970-01-01T00:00:00.000Z";

	private _lastFetchedEpoch: string = null;

	public constructor(
		//private _oAuthSvc: OAuthService,
		private _fetchSvc: FetchService
	) {
		this.configureSingleSignOn();
	}

	public login(): void {
		throw new Error("Not implemented");
		//this._oAuthSvc.initLoginFlow();
	}

	public logout(): void {
		throw new Error("Not implemented");
		//this._oAuthSvc.logOut();
	}

	private configureSingleSignOn(): void {
		//this._oAuthSvc.configure(authConfig);
		//this._oAuthSvc.tokenValidationHandler = new JwksValidationHandler();
		//this._oAuthSvc.loadDiscoveryDocumentAndTryLogin();
		//this._oAuthSvc.loadDiscoveryDocumentAndLogin();
	}

	private getSummitDetails(summitCode: string): Observable<ISotaSummit> {
		return this._fetchSvc.getJson<ISotaSummit>(
			`${this._apiEnv.baseHref}summits/${summitCode}`,
			{}
		);
	}

	public subscribeToSpots(
		updateInterval?: number,
		cancellationToken?: CancellationToken
	): Observable<Spot> {
		const siteFilterRegex = new RegExp(this._apiEnv.siteFilter);

		return this._fetchSvc
			.pollText<string>(
				this._apiEnv.pollIntervalMinutes,
				this._epochEndpoint,
				{},
				cancellationToken
			)
			.pipe(
				filter((epoch) => epoch !== this._lastFetchedEpoch),
				mergeMap(() => {
					return this._fetchSvc.getJson<ISotaSpot[]>(this._spotsEndpoint, {});
				}),
				map((v) => {
					const lastTime = this._lastFetchedSpotTime;

					const filtered = v.filter(
						(s) => s.timeStamp > lastTime && siteFilterRegex.test(s.summitCode)
					);

					if (filtered.length > 0) {
						this._lastFetchedEpoch = filtered[0].epoch;
					}

					return filtered;
				}),

				mergeMap((v) => v), //convert the array of spots into a stream of spots
				map((v) => {
					const spot = new Spot();
					spot.callsign = new Callsign(v.activatorCallsign);
					spot.frequency = v.frequency ?? 0;
					spot.mode = parseSpotMode(v.mode);
					spot.awardList.add(
						new ActivationAward(AwardScheme.SOTA, v.summitCode)
					);
					spot.siteName = v.summitName;
					spot.comment = v.comments;
					spot.spotter = v.callsign;
					spot.lat = 0;
					spot.lon = 0;
					spot.time = new Date(v.timeStamp);

					this._lastFetchedSpotTime =
						this._lastFetchedSpotTime > v.timeStamp
							? this._lastFetchedSpotTime
							: v.timeStamp;

					return spot;
				}),
				mergeMap((spot) => {
					return this.getSummitDetails(
						spot.awardList.findByAwardScheme(AwardScheme.SOTA).siteId
					).pipe(
						map((summit) => {
							spot.lat = summit.latitude;
							spot.lon = summit.longitude;
							return spot;
						}),
						catchError((_) => {
							return of(spot);
						})
					);
				}),
				catchError((error) => {
					console.warn("Error fetching SOTA spots:", error);
					return of(); // Emit an empty observable to keep the stream alive
				})
			);
	}
}

interface ISotaSpot {
	id: number;
	timeStamp: string; // ISO datetime (UTC)
	activatorCallsign: string;
	activatorName: string;
	callsign: string;
	comments: string;
	frequency: number;
	mode: string;
	summitCode: string;
	summitName: string;
	AltM: number;
	AltFt: number;
	points: number;
	userID: number;
	type: string;
	epoch: string; // UUID
}

export interface ISotaRestriction {
	code: number;
	type: string;
}

export interface ISotaSummit {
	associationName: string;
	associationCode: string;
	regionName: string;
	regionCode: string;
	summitCode: string;
	name: string;
	notes: string;
	points: number;
	altM: number;
	altFt: number;
	activationCount: number | null;
	activationCall: string | null;
	activationDate: string | null; // ISO datetime or null
	gridRef1: string;
	gridRef2: string;
	locator: string;
	latitude: number;
	longitude: number;
	myChases: number | null;
	myActivations: number | null;
	validTo: string; // ISO datetime
	validFrom: string; // ISO datetime
	valid: boolean;
	restrictionMask: boolean;
	restrictionList: ISotaRestriction[];
}
