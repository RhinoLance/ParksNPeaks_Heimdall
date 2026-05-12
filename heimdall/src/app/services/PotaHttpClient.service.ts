import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { FetchService } from "./FetchService";
import { PotaPark } from "../models/PotaPark";
import { ISpotSource } from "./ISpotSource";
import { CancellationToken } from "../models/CancellationToken";
import { Spot } from "../models/Spot";
import { map, mergeMap, Observable } from "rxjs";
import { SpotMode } from "../models/SpotMode";
import { Callsign } from "../models/Callsign";
import { ActivationAward } from "../models/ActivationAward";
import { AwardScheme } from "../models/AwardScheme";
import { DataSource } from "src/environments/TEnvironment";

@Injectable({
	providedIn: "root",
})
export class PotaClientService implements ISpotSource {
	private _apiEnv = environment.spotSources.get(DataSource.POTA);
	private _modeMap: { [key: string]: SpotMode } = {
		AM: SpotMode.AM,
		FM: SpotMode.FM,
		SSB: SpotMode.SSB,
		CW: SpotMode.CW,
		FT8: SpotMode.FT8,
		FT4: SpotMode.FT4,
	};

	private _lastFetchedSpotTime: number =
		new Date("1970-01-01T00:00:00.000Z").getTime() / 1000;

	public constructor(private _fetchSvc: FetchService) {}

	public async getPark(parkId: string): Promise<PotaPark> {
		const data = await this.get<PotaPark>(`park/${parkId}`);

		return data;
	}

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
					spot.mode = this._modeMap[v.mode] ?? SpotMode.Other;
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
