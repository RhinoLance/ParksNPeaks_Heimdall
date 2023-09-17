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
import { timer } from "rxjs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { animate, style, transition, trigger } from "@angular/animations";

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
	],
})
export class ActivationComponent implements OnInit {
	@Input() public activation!: Activation;
	@Output() public shown = new EventEmitter<void>();
	@Output() public hiden = new EventEmitter<void>();

	public HideState = HideState;

	public viewState: ViewState = {
		spot: new Spot(),
		supersededSpotList: [],
		elapsedTimeState: ElapsedTimeState.Active,
		hideState: HideState.Visible,
	};

	public readonly liveTimeAgo: boolean = true;

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
	supersededSpotList: Spot[];
	elapsedTimeState: ElapsedTimeState;
	hideState: HideState;
}
