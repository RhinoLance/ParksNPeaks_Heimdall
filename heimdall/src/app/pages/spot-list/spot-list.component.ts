import { Component, OnInit } from "@angular/core";
import { Activation, HideState } from "src/app/models/Activation";
import { ActivationComponent } from "../../components/activation/activation.component";
import { CommonModule } from "@angular/common";
import { DataService } from "src/app/services/DataService";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import { animate, style, transition, trigger } from "@angular/animations";
import { SpotFilterService } from "src/app/services/SpotFilterService";
import { frequencyBands } from "src/app/models/Band";
import { SpotFilterComponent } from "src/app/components/spot-filter/spot-filter.component";
import { debounceTime } from "rxjs";

@Component({
	selector: "pph-spot-list",
	templateUrl: "./spot-list.component.html",
	styleUrls: ["./spot-list.component.scss"],
	imports: [CommonModule, ActivationComponent, SpotFilterComponent],
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
	standalone: true,
})
export class SpotListComponent implements OnInit {
	public viewState: ViewState = {
		activationList: [],
		visibleActivationCount: 0,
	};

	public HideState = HideState;

	public constructor(
		private _dataSvc: DataService,
		private _routerSvc: AppRouter,
		private _spotFilterSvc: SpotFilterService
	) {}

	public ngOnInit(): void {
		const activations = this._dataSvc.getActivations();
		this.processActivationUpdates(activations);

		this._dataSvc.activationUpdated.subscribe((v) => {
			this.processActivationUpdates(v);
		});

		this._spotFilterSvc.filterUpdated.pipe(debounceTime(400)).subscribe(() => {
			this.processActivationUpdates(this._dataSvc.getActivations());
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
				activation.visibleState != HideState.Visible ||
				this.isActivationFilteredOut(activation)
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

	private isActivationFilteredOut(activation: Activation): boolean {
		const latestSpot = activation.getLatestSpot();

		if (this._spotFilterSvc.spotModes.length > 0) {
			if (!this._spotFilterSvc.spotModes.includes(latestSpot.mode)) {
				return true;
			}
		}

		if (this._spotFilterSvc.bands.length > 0) {
			const isInBand = this._spotFilterSvc.bands.some((band) => {
				const bandDef = frequencyBands.find((v) => v.band == band);
				return (
					latestSpot.frequency >= bandDef.lower &&
					latestSpot.frequency <= bandDef.upper
				);
			});

			if (!isInBand) {
				return true;
			}
		}

		if (this._spotFilterSvc.awardSchemes.length > 0) {
			const hasMatchingAward = this._spotFilterSvc.awardSchemes.some(
				(scheme) => {
					return activation.awardList.containsAward(scheme);
				}
			);

			if (!hasMatchingAward) {
				return true;
			}
		}

		return false;
	}
}

type ViewState = {
	activationList: Activation[];
	visibleActivationCount: number;
};
