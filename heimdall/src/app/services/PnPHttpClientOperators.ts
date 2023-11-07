import { OperatorFunction, map, mergeMap, of, throwError } from "rxjs";
import { PostResponse } from "./PnPHttpClient.service";

const responseErrorStrings = ["Failure.", "bad query!"];

function isReponseAnError(response: string): boolean {
	let error = false;

	responseErrorStrings.map((v) => {
		if (response.toLocaleLowerCase() == v.toLocaleLowerCase()) {
			error = true;
		}
	});

	return error ? true : false;
}

export function pnpResponseHasError(): OperatorFunction<PostResponse, boolean> {
	return map((response: PostResponse) => {
		return isReponseAnError(response.response) ? false : true;
	});
}

export function throwOnPnpResponseError(): OperatorFunction<
	PostResponse,
	PostResponse
> {
	return mergeMap((response: PostResponse) => {
		if (isReponseAnError(response.response)) {
			return throwError(() => response);
		} else {
			return of(response);
		}
	});
}

export function pnpResponseToJSON<T>(): OperatorFunction<string, T> {
	return mergeMap((response: string) => {
		if (!isReponseAnError(response)) {
			return of(JSON.parse(response));
		} else {
			return throwError(() => response);
		}
	});
}
