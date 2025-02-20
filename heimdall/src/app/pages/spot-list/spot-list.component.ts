import { Component, OnInit } from "@angular/core";
import { Activation, HideState } from "src/app/models/Activation";
import { ActivationComponent } from "../../components/activation/activation.component";
import { CommonModule } from "@angular/common";
import { RaysDirective } from "../../directives/rays.directive";
import { DataService } from "src/app/services/DataService";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import { animate, style, transition, trigger } from "@angular/animations";
import { SpotFilterComponent } from "src/app/components/spot-filter/spot-filter.component";

@Component({
	selector: "pph-spot-list",
	templateUrl: "./spot-list.component.html",
	styleUrls: ["./spot-list.component.scss"],
	standalone: true,
	imports: [CommonModule, RaysDirective, ActivationComponent, SpotFilterComponent],
	animations: [
		trigger("hideActivationAnimation", [
			transition(":leave", [
				animate(
					150,
					style({
						opacity: 0,
						height: 0,
					})
				),
			]),
		]),
	],
})
export class SpotListComponent implements OnInit {
	public viewState: ViewState = {
		activationList: [],
		visibleActivationCount: 0,
	};

	public HideState = HideState;

	public constructor(
		private _dataSvc: DataService,
		private _routerSvc: AppRouter
	) {}

	public ngOnInit(): void {
		const activations = this._dataSvc.getActivations();
		this.processActivationUpdates(activations);

		this._dataSvc.activationUpdated.subscribe((v) => {
			this.processActivationUpdates(v);
		});
	}

	public onActivationShow(): void {
		throw new Error("Method not implemented.");
	}

	public onActivationHide(activation: Activation): void {
		const index = this.viewState.activationList.findIndex(
			(v) => v.activationId == activation.activationId
		);

		if (index > -1) {
			this.viewState.activationList.splice(index, 1);
		}

		if (
			this.viewState.activationList.filter(
				(v) => v.visibleState == HideState.Visible
			).length == 0
		) {
			this._routerSvc.navigate(RoutePath.Splash);
		}
	}

	private processActivationUpdates(activationList: Activation[]): void {
		let sortRequired = false;

		activationList.map((activation) => {
			const index = this.viewState.activationList.findIndex(
				(v) => v.activationId == activation.activationId
			);

			if (
				activation.isDeleted ||
				activation.visibleState != HideState.Visible
			) {
				//It's removed
				if (index > -1) {
					this.viewState.activationList.splice(index, 1);
				}
			} else if (index == -1) {
				//It's added
				this.viewState.activationList.push(activation);
				sortRequired = true;
			} else {
				//It's updated
				sortRequired = true;
			}
		});

		if (this.viewState.activationList.length == 0) {
			this._routerSvc.navigate(RoutePath.Splash);
		}

		if (sortRequired) {
			this.viewState.activationList.sort((a, b) => {
				return (
					b.getLatestSpot().time.getTime() - a.getLatestSpot().time.getTime()
				);
			});
		}
	}
}

type ViewState = {
	activationList: Activation[];
	visibleActivationCount: number;
};
