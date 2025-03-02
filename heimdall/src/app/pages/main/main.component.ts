import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import packageJson from "../../../../package.json";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import {
	NgbDropdownModule,
	NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { ConnectionStatusComponent } from "src/app/components/connection-status/connection-status.component";

import { NAVIGATOR } from "@ng-web-apis/common";
import { SettingsService } from "src/app/services/SettingsService";
import { RealTimeUserService } from "src/app/services/RealTimeUserService";
import { randomisePoint } from "src/app/utilities/geoUtilities";
import { SpotFilterService } from "src/app/services/SpotFilterService";
import { NotificationManagerComponent } from "src/app/components/notification-manager/notification-manager.component";

@Component({
	selector: "pph-root",
	templateUrl: "./main.component.html",
	styleUrls: ["./main.component.scss"],
	imports: [
		RouterOutlet,
		NgbDropdownModule,
		ConnectionStatusComponent,
		NgbTooltipModule,
		NotificationManagerComponent,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],

	standalone: true,
})
export class MainComponent {
	public viewModel: ViewModel = {
		version: packageJson.version,
		buildVersion: packageJson.buildVersion,
		filterIsActive: false,
	};

	public constructor(
		private _appRouter: AppRouter,
		private _realtimeUserSvc: RealTimeUserService,
		@Inject(NAVIGATOR) private _navigator: Navigator,
		private _settingsSvc: SettingsService,
		private _spotFilterSvc: SpotFilterService
	) {
		_realtimeUserSvc.connectionStateChanged.subscribe((isConnected) => {
			if (isConnected) {
				this.setUserAnalytics();
			}
		});

		this.trackFilterStatus();
	}

	public settingsClick(): void {
		this._appRouter.navigate(RoutePath.Settings);
	}

	public navigateHome() {
		this._appRouter.navigate(RoutePath.SpotList);
	}

	public clearFilters() {
		this._spotFilterSvc.clearFilters();
		this.navigateHome();
	}

	private trackFilterStatus() {
		const setFilterStatus = () => {
			const total =
				this._spotFilterSvc.bands.length +
				this._spotFilterSvc.awardSchemes.length +
				this._spotFilterSvc.spotModes.length;
			this.viewModel.filterIsActive = total > 0;
		};

		setFilterStatus();

		this._spotFilterSvc.filterUpdated.subscribe((_) => {
			setFilterStatus();
		});
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
	filterIsActive: boolean;
};
