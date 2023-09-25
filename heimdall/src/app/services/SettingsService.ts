import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class SettingsService {
	public getUserCallsign(): string {
		return "test";
	}

	public getPnPApiKey(): string {
		return "test";
	}
}
