import { Injectable } from "@angular/core";
import { IFetch } from "./IFetch";
import { Observable, interval, mergeMap, takeUntil } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { CancellationToken } from "../models/CancellationToken";

@Injectable({
	providedIn: "root",
})
export class FetchService implements IFetch {
	public getJsonPromise<T>(url: string, request: RequestInit): Promise<T> {
		return new Promise((resolve, reject) => {
			this.getJson<T>(url, request).subscribe({
				next: (data: T) => {
					return resolve(data);
				},
				error: (err) => reject(err),
			});
		});
	}

	public getJson<T>(url: string, request: RequestInit): Observable<T> {
		const requestInit = {
			selector: (response: Response) => response.json(),
		};
		Object.assign(requestInit, request);

		requestInit.selector = (response: Response) => response.json();

		return fromFetch(url, requestInit);
	}

	/// Returns an observable which calls getJson every updateInterval seconds
	/// @param updateInterval - how often to repeat the request in seconds
	/// @param url - the url to call
	/// @param request - the request to send
	/// @returns an observable of type T

	public pollJson<T>(
		updateInterval: number,
		url: string,
		request: RequestInit,
		cancellationToken: CancellationToken
	): Observable<T> {
		cancellationToken = cancellationToken || new CancellationToken();

		const obs = interval(updateInterval * 1000).pipe(
			mergeMap(() => this.getJson<T>(url, request)),
			takeUntil(cancellationToken.token)
		);

		return obs;
	}
}
