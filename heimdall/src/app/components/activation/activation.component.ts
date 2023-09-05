import { Component, Input, OnInit } from "@angular/core";
import { Activation } from "src/app/models/Activation";
import { Spot } from "src/app/models/Spot";
import { SpotHistoryCardComponent } from "../spot-history-card/spot-history-card.component";
import { ModeBadgeComponent } from "../../mode-badge/mode-badge.component";
import { NgIf, NgFor, NgClass } from "@angular/common";
import { NgPipesModule } from "ngx-pipes";

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
		NgPipesModule,
	],
})
export class ActivationComponent implements OnInit {
	@Input() public activation!: Activation;

	public viewState: ViewState = {
		spot: new Spot(),
		supersededSpotList: [],
	};

	public ngOnInit(): void {
		if (this.activation !== undefined) {
			const spot = this.activation.getLatestSpot();
			if (spot !== null) {
				this.viewState.spot = spot;
			}

			this.viewState.supersededSpotList = this.activation.getSupersededSpots();
		}
	}
}

interface ViewState {
	spot: Spot;
	supersededSpotList: Spot[];
}
