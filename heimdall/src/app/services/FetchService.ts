import { Injectable } from "@angular/core";
import {
	Observable,
	timer,
	mergeMap,
	takeUntil,
	catchError,
	EMPTY,
} from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { CancellationToken } from "../models/CancellationToken";

@Injectable({
	providedIn: "root",
})
export class FetchService {
	public constructor(private _deps: FetchServiceDeps) {}

	public getJsonPromise<T>(url: string, request: RequestInit): Promise<T> {
		return new Promise((resolve, reject) => {
			this.getJson<T>(url, request).subscribe({
				next: (data: T) => {
					return resolve(data);
				},
				error: (err) => {
					return reject("Caught: " + err);
				},
			});
		});
	}

	public getJson<T>(url: string, request: RequestInit): Observable<T> {
		const requestInit = {
			selector: (response: Response) => response.json(),
		};
		Object.assign(requestInit, request);

		return this._deps.fromFetch(url, requestInit);
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
		cancellationToken?: CancellationToken
	): Observable<T> {
		cancellationToken = cancellationToken ?? new CancellationToken();

		const safeRequest = mergeMap(() => {
			return this.getJson<T>(url, request).pipe(catchError((_) => EMPTY));
		});

		const obs = this._deps
			.timer(0, updateInterval * 60 * 1000)
			.pipe(safeRequest, takeUntil(cancellationToken.token));

		return obs;
	}

	public postJson<T>(url: string, body: unknown): Observable<T> {
		const requestInit = {
			selector: (response: Response) => response.json(),
			method: "POST",
			body: JSON.stringify(body),
		};

		return this._deps.fromFetch(url, requestInit);
	}
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type TInit = RequestInit & { selector: (response: any) => unknown };
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type TFromFetch = (input: string, init: TInit) => Observable<any>;
export type TTimer = (
	startAfter: number,
	repeatPeriod: number
) => Observable<unknown>;

@Injectable({
	providedIn: "root",
})
export class FetchServiceDeps {
	public fromFetch: TFromFetch = fromFetch;
	public timer: TTimer = timer;
}
