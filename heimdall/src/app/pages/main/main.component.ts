import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import packageJson from "../../../../package.json";
import { NgIf } from "@angular/common";
import { RaysDirective } from "../../directives/rays.directive";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";

@Component({
	selector: "pph-root",
	templateUrl: "./main.component.html",
	styleUrls: ["./main.component.scss"],
	standalone: true,
	imports: [RouterOutlet, NgIf, RaysDirective],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainComponent {
	public viewModel: ViewState = {
		version: packageJson.version,
	};

	public constructor(private _appRouter: AppRouter) {}

	public settingsClick(): void {
		this._appRouter.navigate(RoutePath.Settings);
	}
}

type ViewState = {
	version: string;
};
