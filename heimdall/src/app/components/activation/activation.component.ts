import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	Input,
	OnInit,
	Output,
	EventEmitter,
} from "@angular/core";
import { Activation, HideState } from "src/app/models/Activation";
import { Spot } from "src/app/models/Spot";
import { SpotHistoryCardComponent } from "../spot-history-card/spot-history-card.component";
import { ModeBadgeComponent } from "../mode-badge/mode-badge.component";
import { CommonModule } from "@angular/common";
import { TimeagoModule } from "ngx-timeago";
import { Subscription, timer } from "rxjs";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
	animate,
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
import { PnPClientService } from "src/app/services/PNPHttpClient.service";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import { backOutLeft } from "ng-animate";
import { tada } from "src/app/utilities/animations";

@Component({
	selector: "pph-activation",
	templateUrl: "./activation.component.html",
	styleUrls: ["./activation.component.scss"],
	standalone: true,
	imports: [
		CommonModule,
		ModeBadgeComponent,
		SpotHistoryCardComponent,
		TimeagoModule,
		MatTooltipModule,
		CopyToClipboardDirective,
		RespotComponent,
		NgbDropdownModule,
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
})
export class ActivationComponent implements OnInit {
	@Input() public activation!: Activation;
	@Output() public shown = new EventEmitter<Activation>();
	@Output() public hiden = new EventEmitter<Activation>();

	public HideState = HideState;

	public viewState: ViewState = {
		spot: new Spot(),
		respot: new Spot(),
		respotIsVisible: false,
		supersededSpotList: [],
		elapsedTimeState: ElapsedTimeState.Active,
		playHideAnimation: false,
		respotSuccess: undefined,
		hasUpdates: false,
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

				if (this.activation.visibleState == HideState.Spot) {
					if (
						oldSpot.mode !== this.viewState.spot.mode ||
						oldSpot.frequency !== this.viewState.spot.frequency
					) {
						this.activation.visibleState = HideState.Visible;
					}
				}

				this.viewState.hasUpdates = true;
				timer(1000).subscribe(() => {
					this.viewState.hasUpdates = false;
				});
			});
		}

		timer(0, 1000 * 60).subscribe((_) => {
			this.setTimeElapsedState();
		});

		this.showActivation();
	}

	public hideActivation(hideState: HideState): void {
		if (hideState === HideState.Visible) {
			return;
		}

		this.activation.visibleState = hideState;
		this.hiden.emit(this.activation);
	}

	public showActivation(): void {
		this.activation.visibleState = HideState.Visible;
		this.shown.emit(this.activation);
	}

	public showReSpot(): void {
		if (!this.pnpClientSvc.hasApiKey || !this.pnpClientSvc.hasUserId) return;

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
};
