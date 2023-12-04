import { Injectable } from "@angular/core";
import { RealTimeUserService } from "./RealTimeUserService";

@Injectable({
	providedIn: "root",
})
export class AppBootstrapService {
	public constructor(private _realtimeUserService: RealTimeUserService) {}

	public init(): void {
		this._realtimeUserService.init();
	}
}
