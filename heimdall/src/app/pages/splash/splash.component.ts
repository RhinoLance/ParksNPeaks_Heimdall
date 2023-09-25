import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RoutePaths } from "src/app/app-routing.module";
import { RaysDirective } from "src/app/directives/rays.directive";
import { HideState } from "src/app/models/Activation";
import { DataService } from "src/app/services/DataService";

@Component({
	selector: "pph-splash",
	templateUrl: "./splash.component.html",
	styleUrls: ["./splash.component.scss"],
	standalone: true,
	imports: [RaysDirective],
})
export class SplashComponent implements OnInit {
	public constructor(private _dataSvc: DataService, private _router: Router) {}

	public ngOnInit(): void {
		this._dataSvc.activationUpdated.subscribe(() => {
			const activationList = this._dataSvc
				.getActivations()
				.filter((v) => v.visibleState == HideState.Visible);

			if (activationList.length > 0) {
				this._router.navigate([RoutePaths.SpotList]);
			}
		});
	}
}
