import { Injectable } from "@angular/core";
import { StorageService } from "./StorageService";
import { Subject, debounceTime } from "rxjs";
import { PnPUser } from "./PnPHttpClient.service";

@Injectable({
	providedIn: "root",
})
export class SettingsService {
	public settingUpdated: Subject<SettingsKey> = new Subject<SettingsKey>();
	private _settingsKey = "settings";

	private _settings: HeimdallSettings = {
		pnpUser: {
			userName: "",
			callsign: "",
			apiKey: "",
		},
	};

	public constructor(private _storageSvc: StorageService) {
		this.loadSavedSettings();
		this.monitorSettingsSaved();
	}

	public setPnpUser(value: PnPUser): void {
		this._settings.pnpUser = value;
		this.settingUpdated.next(SettingsKey.PNP_USER);
	}

	public getPnpUser(): PnPUser {
		return this._settings.pnpUser;
	}

	private loadSavedSettings(): void {
		const settings = this._storageSvc.load<SettingsService>(this._settingsKey);

		if (settings) {
			Object.assign(this._settings, settings);
		}
	}

	private monitorSettingsSaved(): void {
		this.settingUpdated
			.pipe(debounceTime(1000))
			.subscribe(() =>
				this._storageSvc.save(this._settingsKey, this._settings)
			);
	}
}

type HeimdallSettings = {
	pnpUser: PnPUser;
};

export enum SettingsKey {
	PNP_USER = "pnpUser",
	name = "",
}
