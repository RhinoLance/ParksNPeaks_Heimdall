import { Component, OnDestroy, OnInit } from "@angular/core";
import { Activation, ActivationVisibility } from "src/app/models/Activation";
import { ActivationComponent } from "../../components/activation/activation.component";
import { CommonModule } from "@angular/common";
import { DataService } from "src/app/services/DataService";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import { animate, style, transition, trigger } from "@angular/animations";
import { SpotFilterService } from "src/app/services/SpotFilterService";
import { frequencyBands } from "src/app/models/Band";
import { SpotFilterComponent } from "src/app/components/spot-filter/spot-filter.component";
import { buffer, debounceTime, map, ReplaySubject, takeUntil } from "rxjs";
import { NotificationService } from "src/app/services/NotificationService";

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
export class SpotListComponent implements OnInit, OnDestroy {
	private _componentDestroyed = new ReplaySubject<void>();

	//Define local enum ref for template use.
	public __activationVisibilty = ActivationVisibility;

	public viewState: ViewState = {
		activationList: [],
		visibleActivationCount: 0,
	};

	public constructor(
		private _dataSvc: DataService,
		private _routerSvc: AppRouter,
		private _spotFilterSvc: SpotFilterService,
		private _notificationSvc: NotificationService
	) {}

	public ngOnInit(): void {
		const activations = this._dataSvc.activationCalalogue.activations;
		activations.map((v) => this.processActivationUpdate(v));
		this.redirectToSplashOnEmptyList();

		this._spotFilterSvc.filterUpdated
			.pipe(takeUntil(this._componentDestroyed), debounceTime(400))
			.subscribe(() => {
				activations.map((v) => this.processActivationUpdate(v));
			});

		this.configureActivationUpdateWatcher();
	}

	private configureActivationUpdateWatcher(): void {
		const source = this._dataSvc.activationCalalogue.onUpdate.pipe(
			takeUntil(this._componentDestroyed),
			map((activation) => {
				const hasUpdates = this.processActivationUpdate(activation);
				return hasUpdates;
			})
		);

		const debounceUpdates = source.pipe(debounceTime(500));

		source.pipe(buffer(debounceUpdates)).subscribe((hasUpdatesList) => {
			if (hasUpdatesList.some((v) => v)) {
				const latestSpot = this.viewState.activationList[0].getLatestSpot();
				this._notificationSvc.playAudioAlert(latestSpot.mode.charAt(0));
			}

			this.redirectToSplashOnEmptyList();
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
				(v) => v.visibility == ActivationVisibility.Visible
			).length == 0
		) {
			this._routerSvc.navigate(RoutePath.Splash);
		}
	}

	private processActivationUpdate(activation: Activation): boolean {
		let sortRequired = false;

		let hasNewSpots = false;

		const index = this.viewState.activationList.findIndex(
			(v) => v.activationId == activation.activationId
		);

		if (
			activation.isDeleted ||
			activation.visibility != ActivationVisibility.Visible ||
			this.isActivationFilteredOut(activation)
		) {
			//It's removed
			if (index > -1) {
				this.viewState.activationList.splice(index, 1);
			}
		} else {
			if (index == -1) {
				//It's added
				this.viewState.activationList.push(activation);
			} else {
				//It's updated
				this.viewState.activationList[index] = activation;
			}

			hasNewSpots = true;
			sortRequired = true;
		}

		if (sortRequired) {
			this.viewState.activationList.sort((a, b) => {
				return (
					b.getLatestSpot().time.getTime() - a.getLatestSpot().time.getTime()
				);
			});
		}

		return hasNewSpots;
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
				if (bandDef == undefined) return false;
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

	public ngOnDestroy(): void {
		this._componentDestroyed.next();
		this._componentDestroyed.complete();
	}

	private redirectToSplashOnEmptyList(): void {
		if (this.viewState.activationList.length == 0) {
			this._routerSvc.navigate(RoutePath.Splash);
		}
	}
}

type ViewState = {
	activationList: Activation[];
	visibleActivationCount: number;
};
