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

	public fetch<T>(url: string, request: TInit): Observable<T> {
		const headers = request.headers ?? {};
		request = {
			...request,
			headers: {
				"User-Agent": "PnP_Heimdall/1.0",
				...headers,
			},
		};

		return this._deps.fromFetch(url, request);
	}

	public getJsonPromise<T>(url: string, request: RequestInit): Promise<T> {
		return new Promise((resolve, reject) => {
			this.getJson<T>(url, request).subscribe({
				next: (data: T) => {
					return resolve(data);
				},
				error: (err: unknown) => {
					return reject("Caught: " + err);
				},
			});
		});
	}

	public getJson<T>(url: string, request: RequestInit): Observable<T> {
		const requestInit = {
			selector: (response: Response) => response.json(),
			...request,
		};

		return this.fetch(url, requestInit);
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

		(request as TInit).selector = (response: Response) => response.json();

		return this.poll<T>(
			updateInterval,
			url,
			request as TInit,
			cancellationToken
		);
	}

	public pollText<T>(
		updateInterval: number,
		url: string,
		request: RequestInit,
		cancellationToken?: CancellationToken
	): Observable<T> {
		cancellationToken = cancellationToken ?? new CancellationToken();

		(request as TInit).selector = (response: Response) => response.text();

		return this.poll<T>(
			updateInterval,
			url,
			request as TInit,
			cancellationToken
		);
	}

	public poll<T>(
		updateInterval: number,
		url: string,
		request: TInit,
		cancellationToken?: CancellationToken
	): Observable<T> {
		cancellationToken = cancellationToken ?? new CancellationToken();

		const safeRequest = mergeMap(() => {
			return this.fetch<T>(url, request).pipe(
				catchError((_) => {
					console.warn(`Error fetching ${url}:`, _);
					return EMPTY;
				})
			);
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
			headers: {
				"Content-Type": "application/json",
			},
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
