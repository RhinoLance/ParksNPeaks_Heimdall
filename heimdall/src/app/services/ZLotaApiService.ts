import { Injectable } from "@angular/core";
import { ISpotSource } from "./ISpotSource";
import { environment } from "src/environments/environment";
import { parseSpotMode } from "../models/SpotMode";
import { CancellationToken } from "../models/CancellationToken";
import { Spot } from "../models/Spot";
import { catchError, map, mergeMap, Observable, of } from "rxjs";
import { FetchService } from "./FetchService";
import { Callsign } from "../models/Callsign";
import { ActivationAward } from "../models/ActivationAward";
import { DataSource } from "src/environments/TEnvironment";

@Injectable({
	providedIn: "root",
})
export class ZLotaApiService implements ISpotSource {
	private _apiEnv = environment.spotSources.get(DataSource.ZLOTA);
	//private _spotEndpoint = `${this._apiEnv.baseHref}api/spots/?zlota_only=true`;
	private _spotEndpoint = `${this._apiEnv.baseHref}api/spots/`;
	private _siteEndpoint = `${this._apiEnv.baseHref}assets/`;

	private _lastFetchedSpotTime: string = "1970-01-01T00:00:00.000Z";

	public constructor(private _fetchSvc: FetchService) {}

	public subscribeToSpots(
		updateInterval?: number,
		cancellationToken?: CancellationToken
	): Observable<Spot> {
		const siteFilterRegex = new RegExp(this._apiEnv.siteFilter);

		return this._fetchSvc
			.pollJson<IZLotaSpot[]>(
				this._apiEnv.pollIntervalMinutes,
				this._spotEndpoint + `&startTime=${this._lastFetchedSpotTime}`,
				{},
				cancellationToken
			)
			.pipe(
				map((v) => {
					const lastTime = this._lastFetchedSpotTime;

					const filtered = v.filter(
						(s) =>
							s.referenced_time > lastTime && siteFilterRegex.test(s.reference)
					);

					return filtered;
				}),

				mergeMap((v) => v), //convert the array of spots into a stream of spots
				map((v) => {
					const spot = new Spot();
					spot.callsign = new Callsign(v.activator);
					spot.frequency = parseFloat(v.frequency) / 1000;
					spot.mode = parseSpotMode(v.mode);
					spot.siteName = this.extractSiteName(v.reference, v.name);
					spot.comment = v.comments;
					spot.spotter = v.spotter;
					spot.lat = 0;
					spot.lon = 0;
					spot.time = new Date(v.referenced_time);

					const awardList = [
						ActivationAward.fromSiteId(v.reference),
						//...this.extractRelatedAwards(v.name)
					];

					awardList.forEach((award) => spot.awardList.add(award));

					this._lastFetchedSpotTime =
						this._lastFetchedSpotTime > v.referenced_time
							? this._lastFetchedSpotTime
							: v.referenced_time;

					return spot;
				}),
				mergeMap((spot) => {
					const siteId = spot.awardList.getAtIndex(0).siteId;

					return this.getSiteCoords(siteId).pipe(
						map((latLng) => {
							spot.lat = latLng[0];
							spot.lon = latLng[1];
							return spot;
						}),
						catchError((_) => {
							return of(spot);
						})
					);
				}),
				catchError((error) => {
					console.warn("Error fetching ZLOTA spots:", error);
					return of(); // Emit an empty observable to keep the stream alive
				})
			);
	}

	public getSiteCoords(siteId: string): Observable<number[]> {
		siteId = siteId.replace("/", "_");

		return this._fetchSvc.getText(`${this._siteEndpoint}${siteId}`, {}).pipe(
			map((data) => {
				const latLng = this.extractCoords(data);

				return latLng;
			}),
			catchError((error) => {
				console.warn(`Error fetching site details for ${siteId}:`, error);
				return of([0, 0]);
			})
		);
	}

	private extractCoords(data: string): number[] {
		const regEx = /place_init\('POINT \((-?\d+\.\d+) (-?\d+\.\d+)\)/;

		const coords = data.match(regEx);

		if (coords === null) {
			throw new Error("Could not extract coords");
		}

		//extract the coords from the match
		const longitude = parseFloat(coords[1]);
		const latitude = parseFloat(coords[2]);
		const coord = [latitude, longitude];

		return coord;
	}

	private extractSiteName(reference: string, name: string): string {
		if (!name.includes(reference)) {
			return name;
		}

		const siteList = name.split(";").map((s) => s.trim());
		const site = siteList.find((s) => s.includes(reference));

		return site.substring(0, site.indexOf(reference) - 1).trim();
	}

	private extractRelatedAwards(name: string): ActivationAward[] {
		//There may be additional awards envcoded into the name field.
		// e.g.
		// Cloudy Hill [ZL3/CB-474] {RE56ur}; Korowai - Torlesse
		// Tussocklands Conservation Park [ZLFF-0027] {RE56vq};
		// Korowai/Torlesse Tussocklands Conservation Park [NZ-0147]
		// {RE56vr}; Korowai/Torlesse Tussocklands Park
		// [ZLP/CB-0015] {RE56vr}

		const regex = /\[(.*?)\]/g;
		const matches = [...name.matchAll(regex)].map((m) => m[1]);
		if (matches.length === 0) {
			return [];
		}

		return matches
			.map((siteId) => {
				return ActivationAward.fromSiteId(siteId);
			})
			.filter((award): award is ActivationAward => award !== null);
	}
}
// Inline raw spot payload received from the ZL Ota feed
interface IZLotaSpot {
	activator: string;
	comments: string;
	frequency: string;
	id: number;
	mode: string;
	name: string;
	reference: string;
	referenced_time: string; // ISO datetime (UTC)
	spotter: string;
}

export interface IZLotaAsset {
	id: number;
	code: string;
	old_code?: string;
	name: string;
	asset_type: string;
	region: string;
	area: number;
	altitude: number | null;
	created_at: string;
	updated_at: string;
	is_active: boolean;
	location: string; // WKT POINT(long lat)
	minor: boolean;
	url: string;
}
