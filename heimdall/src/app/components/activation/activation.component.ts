import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	Input,
	OnInit,
	Output,
	EventEmitter,
} from "@angular/core";
import { Activation } from "src/app/models/Activation";
import { Spot } from "src/app/models/Spot";
import { SpotHistoryCardComponent } from "../spot-history-card/spot-history-card.component";
import { ModeBadgeComponent } from "../mode-badge/mode-badge.component";
import { CommonModule } from "@angular/common";
import { TimeagoModule } from "ngx-timeago";
import { Subscription, timer } from "rxjs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import {
	AUTO_STYLE,
	animate,
	state,
	style,
	transition,
	trigger,
} from "@angular/animations";
import { MatOptionModule } from "@angular/material/core";
import { CopyToClipboardDirective } from "src/app/directives/copy-to-clipboard.directive";
import { RespotComponent } from "../respot/respot.component";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

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
		MatDialogModule,
		MatOptionModule,
		CopyToClipboardDirective,
		RespotComponent,
		NgbDropdownModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
		trigger("toggleRespot", [
			state("visible", style({ width: AUTO_STYLE, visibility: AUTO_STYLE })),
			state("hidden", style({ width: "0", visibility: "hidden" })),
			transition("visible => hidden", animate("250ms ease-in")),
			transition("hidden => visible", animate("250ms ease-out")),
		]),
	],
})
export class ActivationComponent implements OnInit {
	@Input() public activation!: Activation;
	@Output() public shown = new EventEmitter<void>();
	@Output() public hiden = new EventEmitter<void>();

	public HideState = HideState;

	public viewState: ViewState = {
		spot: new Spot(),
		respot: new Spot(),
		respotIsVisible: false,
		supersededSpotList: [],
		elapsedTimeState: ElapsedTimeState.Active,
		hideState: HideState.Visible,
	};

	public readonly liveTimeAgo: boolean = true;

	private _clipcoardVal: string = "";
	private _clipboardTimeout: Subscription | undefined;

	/**
	 *
	 */
	public constructor(private _dialog: MatDialog) {}

	public ngOnInit(): void {
		if (this.activation !== undefined) {
			this.activation.onUpdate.subscribe((_) => {
				const oldSpot = this.viewState.spot;

				this.viewState.spot = this.activation.getLatestSpot();

				this.viewState.supersededSpotList = this.activation
					.getSupersededSpots()
					.reverse();

				if (this.viewState.hideState == HideState.Spot) {
					if (
						oldSpot.mode !== this.viewState.spot.mode ||
						oldSpot.frequency !== this.viewState.spot.frequency
					) {
						this.viewState.hideState = HideState.Visible;
					}
				}
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

		this.viewState.hideState = hideState;
		this.hiden.emit();
	}

	public showActivation(): void {
		this.viewState.hideState = HideState.Visible;
		this.shown.emit();
	}

	public reSpot(): void {
		const respot = this.viewState.spot.clone();
		respot.comment = "";

		this.viewState.respotIsVisible = true;
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

export enum HideState {
	Visible = "visible",
	Spot = "spot",
	Activation = "activation",
}

interface ViewState {
	spot: Spot;
	respot: Spot;
	respotIsVisible: boolean;
	supersededSpotList: Spot[];
	elapsedTimeState: ElapsedTimeState;
	hideState: HideState;
}
