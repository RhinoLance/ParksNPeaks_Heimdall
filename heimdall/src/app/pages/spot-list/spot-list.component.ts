import { Component, OnInit } from "@angular/core";
import { Activation, HideState } from "src/app/models/Activation";
import { ActivationComponent } from "../../components/activation/activation.component";
import { CommonModule } from "@angular/common";
import { RaysDirective } from "../../directives/rays.directive";
import { DataService } from "src/app/services/DataService";
import { Router } from "@angular/router";
import { RoutePaths } from "src/app/app-routing.module";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
	selector: "pph-spot-list",
	templateUrl: "./spot-list.component.html",
	styleUrls: ["./spot-list.component.scss"],
	standalone: true,
	imports: [CommonModule, RaysDirective, ActivationComponent],
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

	public constructor(private _dataSvc: DataService, private _router: Router) {}

	public ngOnInit(): void {
		this.retrieveActivationList();

		this._dataSvc.activationUpdated.subscribe(() => {
			this.retrieveActivationList();
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
			this._router.navigate([RoutePaths.Splash]);
		}
	}

	private retrieveActivationList(): void {
		const activationList = this._dataSvc
			.getActivations()
			.filter((v) => v.visibleState == HideState.Visible);

		if (activationList.length == 0) {
			this._router.navigate([RoutePaths.Splash]);
		}

		activationList.sort((a, b) => {
			return (
				b.getLatestSpot().time.getTime() - a.getLatestSpot().time.getTime()
			);
		});

		this.viewState.activationList = activationList;
	}
}

type ViewState = {
	activationList: Activation[];
	visibleActivationCount: number;
};
