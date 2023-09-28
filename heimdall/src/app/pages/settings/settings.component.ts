import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import { SettingsKey, SettingsService } from "src/app/services/SettingsService";

@Component({
	selector: "pph-settings",
	templateUrl: "./settings.component.html",
	styleUrls: ["./settings.component.scss"],
	standalone: true,
	imports: [CommonModule, FormsModule],
})
export class SettingsComponent {
	public viewModel: ViewState;

	public constructor(
		private _settingsSvc: SettingsService,
		private _router: AppRouter
	) {
		this.viewModel = {
			pnpApiKey: this._settingsSvc.get(SettingsKey.PNP_API_KEY) || "",
			pnpUserName: this._settingsSvc.get(SettingsKey.PNP_USERNAME) || "",
		};
	}

	public save() {
		this._settingsSvc.set(SettingsKey.PNP_API_KEY, this.viewModel.pnpApiKey);
		this._settingsSvc.set(SettingsKey.PNP_USERNAME, this.viewModel.pnpUserName);

		this._router.navigate(RoutePath.SpotList);
	}
}

type ViewState = {
	pnpApiKey: string;
	pnpUserName: string;
};
