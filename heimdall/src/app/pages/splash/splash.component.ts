import { Component, OnDestroy, OnInit } from "@angular/core";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import { RaysDirective } from "src/app/directives/rays.directive";
import { ActivationVisibility } from "src/app/models/Activation";
import { DataService } from "src/app/services/DataService";
import { Observable, ReplaySubject, take, takeUntil, takeWhile } from "rxjs";
import { Subject } from "@microsoft/signalr";

@Component({
	selector: "pph-splash",
	templateUrl: "./splash.component.html",
	styleUrls: ["./splash.component.scss"],
	imports: [RaysDirective],
})
export class SplashComponent implements OnInit, OnDestroy {
	private _componentDestroyed = new ReplaySubject<void>();

	public constructor(
		private _dataSvc: DataService,
		private _router: AppRouter
	) {}

	public ngOnInit(): void {
		this._dataSvc.activationCalalogue.onUpdate
			.pipe(takeUntil(this._componentDestroyed))
			.subscribe((activation) => {
				if (activation.visibility === ActivationVisibility.Visible) {
					this._router.navigate(RoutePath.SpotList);
				}
			});
	}

	public ngOnDestroy(): void {
		this._componentDestroyed.next();
		this._componentDestroyed.complete();
	}
}
