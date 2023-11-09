import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import packageJson from "../../../../package.json";
import { NgIf } from "@angular/common";
import { RaysDirective } from "../../directives/rays.directive";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { ConnectionStatusComponent } from "src/app/components/connection-status/connection-status.component";

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

	public constructor(private _appRouter: AppRouter) {}

	public settingsClick(): void {
		this._appRouter.navigate(RoutePath.Settings);
	}

	public navigateHome() {
		this._appRouter.navigate(RoutePath.SpotList);
	}
}

type ViewModel = {
	version: string;
	buildVersion: string;
};
