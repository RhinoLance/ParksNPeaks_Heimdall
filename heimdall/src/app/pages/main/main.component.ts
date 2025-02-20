import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import packageJson from "../../../../package.json";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { ConnectionStatusComponent } from "src/app/components/connection-status/connection-status.component";

import { NAVIGATOR } from "@ng-web-apis/common";
import { SettingsService } from "src/app/services/SettingsService";
import { RealTimeUserService } from "src/app/services/RealTimeUserService";
import { randomisePoint } from "src/app/utilities/geoUtilities";

@Component({
	selector: "pph-root",
	templateUrl: "./main.component.html",
	styleUrls: ["./main.component.scss"],
	imports: [RouterOutlet, NgbDropdownModule, ConnectionStatusComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],

	standalone: true,
})
export class MainComponent {
	public viewModel: ViewModel = {
		version: packageJson.version,
		buildVersion: packageJson.buildVersion,
	};

	public constructor(
		private _appRouter: AppRouter,
		private _realtimeUserSvc: RealTimeUserService,
		@Inject(NAVIGATOR) private _navigator: Navigator,
		private _settingsSvc: SettingsService
	) {
		_realtimeUserSvc.connectionStateChanged.subscribe((isConnected) => {
			if (isConnected) {
				this.setUserAnalytics();
			}
		});
	}

	public settingsClick(): void {
		this._appRouter.navigate(RoutePath.Settings);
	}

	public navigateHome() {
		this._appRouter.navigate(RoutePath.SpotList);
	}

	private async setUserAnalytics() {
		type GeoPromise = () => Promise<GeolocationPosition>;
		const getPosition: GeoPromise = () => {
			return new Promise((resolve, reject) => {
				this._navigator.geolocation.getCurrentPosition(resolve, reject);
			});
		};

		const position = await getPosition();
		const latLng = randomisePoint(
			position.coords.latitude,
			position.coords.longitude,
			2000
		);

		const userName = this._settingsSvc.getPnpUser().userName;

		this._realtimeUserSvc.updateUserDetails(userName, latLng);
	}
}

type ViewModel = {
	version: string;
	buildVersion: string;
};
