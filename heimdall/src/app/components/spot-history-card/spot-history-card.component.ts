import { Component, Input, OnInit } from "@angular/core";
import { Spot } from "src/app/models/Spot";
import { ModeBadgeComponent } from "../../mode-badge/mode-badge.component";
import { NgIf, NgClass, NgStyle, NgFor } from "@angular/common";
import { TimeagoModule } from "ngx-timeago";

@Component({
	selector: "pph-spot-history-card",
	templateUrl: "./spot-history-card.component.html",
	styleUrls: ["./spot-history-card.component.scss"],
	standalone: true,
	imports: [NgIf, NgClass, NgStyle, NgFor, ModeBadgeComponent, TimeagoModule],
})
export class SpotHistoryCardComponent implements OnInit {
	@Input() public spotList: Spot[] = [];
	@Input() public expanded: boolean = false;

	public viewState = {
		bodyDisplay: "",
	};

	public readonly liveTimeAgo: boolean = true;

	public ngOnInit(): void {
		this.viewState.bodyDisplay = this.expanded ? "expanded" : "collapsed";
	}

	public toggleBodyDisplay(): void {
		switch (this.viewState.bodyDisplay) {
			case "collapsed":
				this.viewState.bodyDisplay = "expanded";

				break;
			case "inline":
				this.viewState.bodyDisplay = "expanded";
				break;

			default:
				this.viewState.bodyDisplay = "collapsed";
		}
	}
}
