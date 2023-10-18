import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { FetchService } from "./FetchService";
import { PotaPark } from "../models/PotaPark";

@Injectable({
	providedIn: "root",
})
export class PotaClientService {
	private _baseHref: string = environment.potaBaseHref;

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
			this._baseHref + suffix,
			request
		);

		return data;
	}
}

export type PostResponse = {
	response: string;
};
