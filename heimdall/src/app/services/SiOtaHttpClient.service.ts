import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { FetchService, TInit } from "./FetchService";
import { SiOtaSite } from "../models/SiOtaSite";

@Injectable({
	providedIn: "root",
})
export class SiOtaClientService {
	private _baseHref: string = "https://www.silosontheair.com/";
		//environment.siotaBaseHref;

	private _siteCache = new Map<string, Promise<SiOtaSite>>();
	private _token: string = "";

	public constructor(private _fetchSvc: FetchService) {

	}

	public async getSite(siteId: number): Promise<SiOtaSite> {
		//await this.getCsrfToken();
		const request: RequestInit = {
			method: "GET",
			mode: "cors",
			headers: {
			},
		};
		await fetch("https://www.silosontheair.com/about.html", request);

		const data = await this.get<SiOtaSite>(siteId);

		return data;
	}

	private async get<T>(suffix: number): Promise<T> {
		const request: RequestInit = {
			method: "GET",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				"Cookie": `XSRF=${this._token};`
			},
		};

		console.log( request.headers);

		const data = await this._fetchSvc.getJsonPromise<T>(
			this._baseHref + "silos/silos/" + suffix,
			request
		);

		return data;
	}

	private async getCsrfToken(): Promise<string> {
		
		/*
		if( this._token.length > 0) {
			return Promise.resolve(this._token);
		}
		*/

		const request: TInit = {
			method: "GET",
			headers: {
			},
			selector: (response: Response) => response
		};

		const token = await this._fetchSvc.getPromise<Response>(
			this._baseHref + "about.html",
			request
		).then( response => {
			
			console.log(response.headers);

			const header = response.headers.get("Set-Cookie");
			const regEx = /XSRF=([\w\d]+);/;
			const token = header.match(regEx)[1];

			console.log(`Token: ${token}`);

			return token;
		});

		return token;
	}
}

export type PostResponse = {
	response: string;
};


