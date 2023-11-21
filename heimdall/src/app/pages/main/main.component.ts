import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import packageJson from "../../../../package.json";
import { NgIf } from "@angular/common";
import { RaysDirective } from "../../directives/rays.directive";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { ConnectionStatusComponent } from "src/app/components/connection-status/connection-status.component";
import { HeimdallSignalrService } from "src/app/services/HeimdallSignalRService";

import { NAVIGATOR } from "@ng-web-apis/common";
import { SettingsKey, SettingsService } from "src/app/services/SettingsService";
import { LatLng } from "src/app/models/LatLng";

@Component({
	selector: "pph-root",
	templateUrl: "./main.component.html",
	styleUrls: ["./main.component.scss"],
	standalone: true,
	imports: [
		RouterOutlet,
		NgIf,
		RaysDirective,
		NgbDropdownModule,
		ConnectionStatusComponent,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainComponent {
	public viewModel: ViewModel = {
		version: packageJson.version,
		buildVersion: packageJson.buildVersion,
	};

	public constructor(
		private _appRouter: AppRouter,
		private _heimdallSignalRSvc: HeimdallSignalrService,
		@Inject(NAVIGATOR) private _navigator: Navigator,
		private _settingsSvc: SettingsService
	) {
		_heimdallSignalRSvc.connectionStateChanged.subscribe((isConnected) => {
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
		const userName = this._settingsSvc.get<string>(
			SettingsKey.PNP_USERNAME
		) as string;

		this._heimdallSignalRSvc.updateUserDetails(
			userName,
			new LatLng(position.coords.latitude, position.coords.longitude)
		);
	}
}

type ViewModel = {
	version: string;
	buildVersion: string;
};
