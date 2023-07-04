import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { PnPSpot } from "../models/PnPSpot";
import { Spot } from "../models/Spot";
import { SpotBuilder } from "../models/SpotBuilder";

@Injectable({
	providedIn: "root",
})
export class PNPClientService {
	//_phpBaseHref: string = 'https://parksnpeaks.org/api/';
	//_phpBaseHref: string = 'https://localhost:44321/api/PnP/Get?suffix=';
	private _phpBaseHref: string = environment.pnpBaseHref;

	public async getSpotList(): Promise<Spot[]> {
		//const data = await this.get<PnPSpot[]>("VK");
		let data = await this.get<PnPSpot[]>("ALL");

		data = data
			.filter(
				(v) => v.actCallsign.includes("VK") || v.actCallsign.includes("ZL")
			)
			.sort((a, b) => {
				return new Date(a.actTime).getTime() - new Date(b.actTime).getTime();
			});

		const output: Spot[] = data.map((pnpSpot: PnPSpot) =>
			new SpotBuilder().addPnpSpot(pnpSpot).build()
		);

		return output;
	}

	private async get<T>(suffix: string): Promise<T> {
		const request: RequestInit = {
			method: "GET",
			headers: {
				"Content-Type": "text/html; charset=UTF-8",
			},
		};

		const data: Promise<T> = await fetch(this._phpBaseHref + suffix, request)
			.then((response) => {
				const output = response.json();
				return output;
			})
			.then((data) => {
				const output = data;
				return output;
			});

		return data;
	}
}