import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import { PnPUser } from "src/app/services/PnPHttpClient.service";
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
			pnpUser: this._settingsSvc.getPnpUser(),
		};
	}

	public save() {
		this._settingsSvc.setPnpUser(this.viewModel.pnpUser);
		this._router.navigate(RoutePath.SpotList);
	}
}

type ViewState = {
	pnpUser: PnPUser;
};
