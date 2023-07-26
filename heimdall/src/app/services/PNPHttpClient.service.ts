import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { PnPSpot } from "../models/PnPSpot";
import { Spot } from "../models/Spot";
import { Observable, map } from "rxjs";
import { CancellationToken } from "../models/CancellationToken";
import { FetchService } from "./FetchService";
import { SpotListBuilder } from "../models/SpotListBuilder";

@Injectable({
	providedIn: "root",
})
export class PnPClientService {
	private _phpBaseHref: string = environment.pnpBaseHref;

	private _pnpSubscription = {
		latestSpot: new Date("1970-01-01T00:00:00.000Z"),
	};

	private _fetchSvc: FetchService;

	public constructor(_fetchSvc: FetchService) {
		this._fetchSvc = _fetchSvc;
	}

	//public transformPnPToSpotList(pnpSpots: PnPSpot[]): Spot[] {}

	public async getSpotList(): Promise<Spot[]> {
		//const data = await this.get<PnPSpot[]>("VK");
		const data = await this.get<PnPSpot[]>("ALL");

		return new SpotListBuilder()
			.setCallsignFilter("VK|ZL")
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
			.pollJson<PnPSpot[]>(updateInterval, "ALL", {}, cancellationToken)
			.pipe(
				map((spots) => {
					return this.filterOldSpots(spots);
				})
			);

		return obs;
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

	private filterOldSpots(spots: Spot[]): Spot[] {
		const output = spots.filter((spot) => {
			return (
				new Date(spot.time).getTime() >
				this._pnpSubscription.latestSpot.getTime()
			);
		});

		if (spots.length > 0) {
			this._pnpSubscription.latestSpot = spots.reduce((prev, current) =>
				prev.time > current.time ? prev : current
			).time;
		}

		return output;
	}
}
