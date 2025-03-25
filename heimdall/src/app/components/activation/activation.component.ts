import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	Input,
	OnInit,
	Output,
	EventEmitter,
} from "@angular/core";
import { Activation, ActivationVisibility } from "src/app/models/Activation";
import { Spot } from "src/app/models/Spot";
import { SpotHistoryCardComponent } from "../spot-history-card/spot-history-card.component";
import { ModeBadgeComponent } from "../mode-badge/mode-badge.component";
import { CommonModule } from "@angular/common";
import { TimeagoModule } from "ngx-timeago";
import { Subscription, timer } from "rxjs";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
	animateChild,
	group,
	query,
	transition,
	trigger,
	useAnimation,
} from "@angular/animations";
import { CopyToClipboardDirective } from "src/app/directives/copy-to-clipboard.directive";
import { RespotComponent } from "../respot/respot.component";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DataService } from "src/app/services/DataService";
import { PnPClientService } from "src/app/services/PnPHttpClient.service";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import { backOutLeft } from "ng-animate";
import { tada } from "src/app/utilities/animations";
import { ActivationAward } from "src/app/models/ActivationAward";
import { LatLng } from "src/app/models/LatLng";
import { ActivationPathMapComponent } from "../activation-path-map/activation-path-map.component";
import { AwardScheme } from "src/app/models/AwardScheme";
import { CallsignDetails } from "src/app/models/CallsignDetails";
import { CallsignNameComponent } from "../callsign-name/callsign-name.component";

@Component({
	selector: "pph-activation",
	templateUrl: "./activation.component.html",
	styleUrls: ["./activation.component.scss"],
	imports: [
		CommonModule,
		ModeBadgeComponent,
		SpotHistoryCardComponent,
		TimeagoModule,
		MatTooltipModule,
		CopyToClipboardDirective,
		RespotComponent,
		NgbDropdownModule,
		ActivationPathMapComponent,
		CallsignNameComponent,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	animations: [
		trigger("respotSuccess", [
			transition("* => true", useAnimation(backOutLeft)),
		]),
		trigger("lookAtMeAnimation", [
			transition(
				"* => true",
				group([useAnimation(tada), query("@respotSuccess", [animateChild()])])
			),
		]),
	],
	standalone: true,
})
export class ActivationComponent implements OnInit {
	@Input() public activation!: Activation;
	@Output() public shown = new EventEmitter<Activation>();
	@Output() public hiden = new EventEmitter<Activation>();

	public __activationVisiblility = ActivationVisibility;

	public expand: boolean = false;
	public viewState: ViewState = {
		spot: new Spot(),
		respot: new Spot(),
		respotIsVisible: false,
		supersededSpotList: [],
		elapsedTimeState: ElapsedTimeState.Active,
		playHideAnimation: false,
		respotSuccess: undefined,
		hasUpdates: false,
		siteDetailsRetrieved: false,
		mapStart: undefined,
		mapEnd: undefined,
		callsignDetails: undefined,
	};

	public readonly liveTimeAgo: boolean = true;

	private _clipcoardVal: string = "";
	private _clipboardTimeout: Subscription | undefined;

	public constructor(
		private _dataSvc: DataService,
		public pnpClientSvc: PnPClientService,
		private _router: AppRouter
	) {}

	public ngOnInit(): void {
		if (this.activation !== undefined) {
			this.activation.onUpdate.subscribe((_) => {
				const oldSpot = this.viewState.spot;

				this.viewState.spot = this.activation.getLatestSpot();
				this.viewState.respot.frequency = 888;

				this.viewState.supersededSpotList = this.activation
					.getSupersededSpots()
					.reverse();

				if (
					this.activation.visibility ==
					ActivationVisibility.HiddenPendingNewBandOrMode
				) {
					if (
						oldSpot.mode !== this.viewState.spot.mode ||
						oldSpot.frequency !== this.viewState.spot.frequency
					) {
						this.activation.visibility = ActivationVisibility.Visible;
					}
				}

				this.viewState.hasUpdates = true;
				timer(1000).subscribe(() => {
					this.viewState.hasUpdates = false;
				});

				if (!this.viewState.siteDetailsRetrieved) {
					this.retrieveSiteDetails();
				}
			});
		}

		timer(0, 1000 * 60).subscribe((_) => {
			this.setTimeElapsedState();
		});

		this.setMapStart();

		this.showActivation();
	}

	public async retrieveSiteDetails(): Promise<void> {
		const schemes = [
			AwardScheme.WWFF,
			AwardScheme.SOTA,
			AwardScheme.POTA,
			AwardScheme.ZLOTA,
		];

		let award: ActivationAward | undefined;
		while (award == undefined && schemes.length > 0) {
			award = this.activation.awardList.findByAwardScheme(
				schemes.pop() as string
			);
		}

		if (award == undefined) return;

		const site = await this._dataSvc.getSiteDetails(award);
		this.viewState.mapEnd = new LatLng(site.latitude, site.longitude);

		this.viewState.siteDetailsRetrieved = true;
	}

	public setMapStart(): void {
		navigator.geolocation.getCurrentPosition((position) => {
			this.viewState.mapStart = new LatLng(
				position.coords.latitude,
				position.coords.longitude
			);
		});
	}

	public hideActivation(visibility: ActivationVisibility): void {
		if (visibility === ActivationVisibility.Visible) {
			return;
		}

		this.activation.visibility = visibility;
		this.hiden.emit(this.activation);
	}

	public showActivation(): void {
		this.activation.visibility = ActivationVisibility.Visible;
		this.shown.emit(this.activation);
	}

	public showReSpot(): void {
		if (!this._dataSvc.canSpot) return;

		this.viewState.spot.copyTo(this.viewState.respot);
		this.viewState.respot.comment = "";

		this.viewState.respotIsVisible = true;
	}

	public hideRespot(): void {
		this.viewState.respotIsVisible = false;
	}

	public onRespotSent(success: boolean) {
		this.viewState.respotSuccess = success;
		if (success) {
			timer(2000).subscribe(() => {
				this.viewState.respotSuccess = undefined;
			});
		}
	}

	public respotSuccessAnimDone() {
		this.viewState.respotIsVisible = false;
	}

	public onClipboardCopy(value: string): void {
		this._clipboardTimeout?.unsubscribe();
		this._clipboardTimeout = timer(5000).subscribe(() => {
			this._clipcoardVal = "";
		});

		this._clipcoardVal =
			this._clipcoardVal.length > 0 ? this._clipcoardVal + " " + value : value;

		navigator.clipboard.writeText(this._clipcoardVal);
	}

	public openSettings() {
		this._router.navigate(RoutePath.Settings);
	}

	private setTimeElapsedState(): void {
		const diffMinutes =
			(new Date().getTime() - this.viewState.spot.time.getTime()) / 1000 / 60;

		this.viewState.elapsedTimeState =
			diffMinutes < 15
				? ElapsedTimeState.Active
				: diffMinutes < 60
				? ElapsedTimeState.Shoulder
				: ElapsedTimeState.Inactive;
	}
}

export enum ElapsedTimeState {
	Active = "active",
	Shoulder = "shoulder",
	Inactive = "inactive",
}

type ViewState = {
	spot: Spot;
	respot: Spot;
	respotIsVisible: boolean;
	supersededSpotList: Spot[];
	elapsedTimeState: ElapsedTimeState;
	playHideAnimation: boolean;
	respotSuccess: boolean | undefined;
	hasUpdates: boolean;
	siteDetailsRetrieved: boolean;
	mapStart?: LatLng;
	mapEnd?: LatLng;
	callsignDetails?: CallsignDetails;
};
