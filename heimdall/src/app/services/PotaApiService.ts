import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { FetchService } from "./FetchService";
import { PotaPark } from "../models/PotaPark";
import { ISpotSource } from "./ISpotSource";
import { CancellationToken } from "../models/CancellationToken";
import { Spot } from "../models/Spot";
import { map, mergeMap, Observable } from "rxjs";
import { parseSpotMode } from "../models/SpotMode";
import { Callsign } from "../models/Callsign";
import { ActivationAward } from "../models/ActivationAward";
import { AwardScheme } from "../models/AwardScheme";
import { DataSource } from "src/environments/IEnvironment";
import { ISiteInfo, ISiteInfoSource } from "./ISiteInfoSource";

@Injectable({
	providedIn: "root",
})
export class PotaApiService implements ISpotSource, ISiteInfoSource {
	private _apiEnv = environment.spotSources.get(DataSource.POTA);

	private _lastFetchedSpotTime: number =
		new Date("1970-01-01T00:00:00.000Z").getTime() / 1000;

	public constructor(private _fetchSvc: FetchService) {}

	private async get<T>(suffix: string): Promise<T> {
		const request: RequestInit = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		};

		const data = await this._fetchSvc.getJsonPromise<T>(
			this._apiEnv.baseHref + suffix,
			request
		);

		return data;
	}

	public subscribeToSpots(
		updateInterval?: number,
		cancellationToken?: CancellationToken
	): Observable<Spot> {
		const siteFilterRegex = new RegExp(this._apiEnv.siteFilter);

		return this._fetchSvc
			.pollJson<IPotaSpot[]>(
				this._apiEnv.pollIntervalMinutes,
				this._apiEnv.baseHref,
				{},
				cancellationToken
			)
			.pipe(
				map((v) => {
					const lastTime = this._lastFetchedSpotTime;

					return v.filter(
						(s) =>
							new Date(s.spotTime + "Z").getTime() / 1000 > lastTime &&
							siteFilterRegex.test(s.reference)
					);
				}),

				mergeMap((v) => v), //convert the array of spots into a stream of spots
				map((v) => {
					const spot = new Spot();
					spot.callsign = new Callsign(v.activator);
					spot.frequency = parseFloat(v.frequency) / 1000;
					spot.mode = parseSpotMode(v.mode);
					spot.awardList.add(
						new ActivationAward(AwardScheme.POTA, v.reference)
					);
					spot.siteName = v.name ?? v.parkName ?? "Unamed Park";
					spot.comment = v.comments;
					spot.spotter = v.spotter;
					spot.lat = v.latitude;
					spot.lon = v.longitude;
					spot.time = new Date(v.spotTime + "Z");

					this._lastFetchedSpotTime = Math.max(
						this._lastFetchedSpotTime,
						new Date(v.spotTime + "Z").getTime() / 1000
					);

					return spot;
				})
			);
	}

	public getSiteInfo(siteId: string): Observable<ISiteInfo> {
		const url = `${this._apiEnv.baseHref}park/${siteId}`;

		return this._fetchSvc.getJson<PotaPark>(url, {}).pipe(
			map((park) => {
				return {
					siteId: park.reference,
					siteName: park.name,
					lat: park.latitude,
					lon: park.longitude,
				} as ISiteInfo;
			})
		);
	}
}

export type PostResponse = {
	response: string;
};

export interface IPotaSpot {
	spotId: number;
	activator: string;
	frequency: string;
	mode: string;
	reference: string;
	parkName: string | null;
	spotTime: string; // ISO datetime
	spotter: string;
	comments: string;
	source: string;
	invalid: boolean | null;
	name: string;
	locationDesc: string;
	grid4: string;
	grid6: string;
	latitude: number;
	longitude: number;
	count: number;
	expire: number;
}

export interface IPotaPark {
	parkId: number;
	reference: string;
	name: string;
	latitude: number;
	longitude: number;
	grid4: string;
	grid6: string;
	parktypeId: number;
	active: number;
	parkComments: string;
	accessibility: string | null;
	sensitivity: string | null;
	accessMethods: string[] | null;
	activationMethods: string[] | null;
	agencies: string[] | null;
	agencyURLs: string[] | null;
	parkURLs: string[] | null;
	website: string;
	createdByAdmin: string;
	parktypeDesc: string;
	locationDesc: string;
	locationName: string;
	entityId: number;
	entityName: string;
	referencePrefix: string;
	entityDeleted: number;
}
