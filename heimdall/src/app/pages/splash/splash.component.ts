import { Component, OnInit } from "@angular/core";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import { RaysDirective } from "src/app/directives/rays.directive";
import { HideState } from "src/app/models/Activation";
import { DataService } from "src/app/services/DataService";

@Component({
	selector: "pph-splash",
	templateUrl: "./splash.component.html",
	styleUrls: ["./splash.component.scss"],
	imports: [RaysDirective],
})
export class SplashComponent implements OnInit {
	public constructor(
		private _dataSvc: DataService,
		private _router: AppRouter
	) {}

	public ngOnInit(): void {
		this._dataSvc.activationUpdated.subscribe(() => {
			const activationList = this._dataSvc
				.getActivations()
				.filter((v) => v.visibleState == HideState.Visible);

			if (activationList.length > 0) {
				this._router.navigate(RoutePath.SpotList);
			}
		});
	}
}
