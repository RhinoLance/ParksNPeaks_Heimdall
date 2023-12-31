import { Injectable } from "@angular/core";
import { StorageService } from "./StorageService";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class SettingsService {
	public settingUpdated: Subject<SettingsKey> = new Subject<SettingsKey>();

	private _settings: HeimdallSettings = {
		pnpApiKey: "",
		callsign: "",
	};

	public constructor(private _storageSvc: StorageService) {
		this.loadSavedSettings();
	}

	public set(key: SettingsKey, value: string | unknown): void {
		this._settings[key as keyof HeimdallSettings] = value;
		this._storageSvc.save("settings", this._settings);

		this.settingUpdated.next(key);
	}

	public get<T>(key: SettingsKey): T | undefined {
		return this._settings[key as keyof HeimdallSettings] as T;
	}

	private loadSavedSettings(): void {
		const settings = this._storageSvc.load<SettingsService>("settings");

		if (settings) {
			Object.assign(this._settings, settings);
		}
	}
}

type HeimdallSettings = {
	pnpApiKey: unknown;
	callsign: unknown;
};

export enum SettingsKey {
	PNP_API_KEY = "pnpApiKey",
	PNP_USERNAME = "pnpUserName",
	CALLSIGN = "callsign",
}
