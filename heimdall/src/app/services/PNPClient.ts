import { Injectable } from '@angular/core';
import { PnPSpot, Spot } from '../models/Spot';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class PNPClient {
	//_phpBaseHref: string = 'https://parksnpeaks.org/api/';
	//_phpBaseHref: string = 'https://localhost:44321/api/PnP/Get?suffix=';
	_phpBaseHref: string = environment.pnpBaseHref;

	constructor() {}

	public async getSpotList(): Promise<Spot[]> {
		//const data = await this.get<any[]>('VK');
		const data = await this.get<any[]>('ALL');

		const output: Spot[] = data.map((pnpSpot: PnPSpot) =>
			PnPSpot.toSpot(pnpSpot)
		);

		return output;
	}

	private async get<T>(suffix: string): Promise<T> {
		const request: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'text/html; charset=UTF-8',
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
