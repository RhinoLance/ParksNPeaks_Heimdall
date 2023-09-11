import { Component, Input, OnInit } from "@angular/core";
import { Activation } from "src/app/models/Activation";
import { Spot } from "src/app/models/Spot";
import { SpotHistoryCardComponent } from "../spot-history-card/spot-history-card.component";
import { ModeBadgeComponent } from "../../mode-badge/mode-badge.component";
import { NgIf, NgFor, NgClass } from "@angular/common";
import { TimeagoModule } from "ngx-timeago";
import { timer } from "rxjs";

@Component({
	selector: "pph-activation",
	templateUrl: "./activation.component.html",
	styleUrls: ["./activation.component.scss"],
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		NgClass,
		ModeBadgeComponent,
		SpotHistoryCardComponent,
		TimeagoModule,
	],
})
export class ActivationComponent implements OnInit {
	@Input() public activation!: Activation;

	public viewState: ViewState = {
		spot: new Spot(),
		supersededSpotList: [],
		elapsedTimeState: ElapsedTimeState.Active,
	};

	public readonly liveTimeAgo: boolean = true;

	public ngOnInit(): void {
		if (this.activation !== undefined) {
			this.activation.onUpdate.subscribe((_) => {
				this.viewState.spot = this.activation.getLatestSpot();

				this.viewState.supersededSpotList = this.activation
					.getSupersededSpots()
					.reverse();
			});
		}

		timer(0, 1000 * 60).subscribe((_) => {
			this.setTimeElapsedState();
		});
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

interface ViewState {
	spot: Spot;
	supersededSpotList: Spot[];
	elapsedTimeState: ElapsedTimeState;
}
