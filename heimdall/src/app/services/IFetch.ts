import { Observable } from "rxjs";
import { CancellationToken } from "../models/CancellationToken";

export interface IFetch {
	getJsonPromise<T>(url: string, request: RequestInit): Promise<T>;
	getJson<T>(url: string, request: RequestInit): Observable<T>;
	pollJson<T>(
		updateInterval: number,
		url: string,
		request: RequestInit,
		cancellationToken: CancellationToken
	): Observable<T>;
}
