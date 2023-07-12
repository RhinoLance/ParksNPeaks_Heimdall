import { Subject } from "rxjs";

export class CancellationToken {
	private _token = new Subject<boolean>();
	private _isCancelled = false;

	public get isCancelled() {
		return this._isCancelled;
	}
	public get token() {
		return this._token;
	}

	public cancel() {
		this._isCancelled = true;
		this._token.next(true);
		this._token.complete();
	}
}
