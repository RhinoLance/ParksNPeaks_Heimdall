import { Injectable } from "@angular/core";
import { ISpotSource } from "./ISpotSource";
import { Spot } from "../models/Spot";
import { Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { FetchService } from "./FetchService";

import { environment } from "src/environments/environment";
import { CancellationToken } from "../models/CancellationToken";
import { parseSpotMode } from "../models/SpotMode";
import { Callsign } from "../models/Callsign";
import { ActivationAward } from "../models/ActivationAward";
import { AwardScheme } from "../models/AwardScheme";
import { DataSource } from "src/environments/IEnvironment";

@Injectable({
	providedIn: "root",
})
export class WwffApiService implements ISpotSource {
	private _apiEnv = environment.spotSources.get(DataSource.WWFF);

	private _lastFetchedSpotTime: number =
		new Date("1970-01-01T00:00:00.000Z").getTime() / 1000;

	public constructor(public _fetchSvc: FetchService) {}

	public subscribeToSpots(
		updateInterval?: number,
		cancellationToken?: CancellationToken
	): Observable<Spot> {
		const siteFilterRegex = new RegExp(this._apiEnv.siteFilter);

		return this._fetchSvc
			.pollJson<IWwffSpot[]>(
				this._apiEnv.pollIntervalMinutes,
				this._apiEnv.baseHref,
				{},
				cancellationToken
			)
			.pipe(
				map((v) => {
					const lastTime = this._lastFetchedSpotTime;

					return v.filter(
						(s) => s.spot_time > lastTime && siteFilterRegex.test(s.reference)
					);
				}),

				mergeMap((v) => v), //convert the array of spots into a stream of spots
				map((v) => {
					const spot = new Spot();
					spot.callsign = new Callsign(v.activator);
					spot.frequency = v.frequency_khz / 1000;
					spot.mode = parseSpotMode(v.mode);
					spot.awardList.add(
						new ActivationAward(AwardScheme.WWFF, v.reference)
					);
					spot.siteName = v.reference_name;
					spot.comment = v.remarks;
					spot.spotter = v.spotter;
					spot.lat = v.latitude;
					spot.lon = v.longitude;
					spot.time = new Date(v.spot_time * 1000);

					this._lastFetchedSpotTime = Math.max(
						this._lastFetchedSpotTime,
						v.spot_time
					);

					return spot;
				})
			);
	}
}

interface IWwffSpot {
	id: number;
	activator: string;
	frequency_khz: number;
	mode: string;
	reference: string;
	reference_name: string;
	remarks: string;
	spotter: string;
	latitude: number;
	longitude: number;
	spot_time: number;
	spot_time_formatted: string;
}
