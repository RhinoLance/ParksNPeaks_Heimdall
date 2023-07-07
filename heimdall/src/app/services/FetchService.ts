import { Injectable } from "@angular/core";
import { IFetch } from "./IFetch";

@Injectable({
	providedIn: "root",
})
export class FetchService implements IFetch {
	public getJson<T>(url: string, request: RequestInit): Promise<T> {
		return fetch(url, request)
			.then((response) => {
				const output = response.json();
				return output;
			})
			.then((data) => {
				const output = data;
				return output;
			});
	}
}
