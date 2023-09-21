import { Component, Input } from "@angular/core";
import { SpotMode } from "../../models/SpotMode";

@Component({
	selector: "pph-mode-badge",
	templateUrl: "./mode-badge.component.html",
	styleUrls: ["./mode-badge.component.scss"],
	standalone: true,
})
export class ModeBadgeComponent {
	@Input() public set mode(mode: SpotMode) {
		mode = mode ?? SpotMode.Other;
		this.viewState.mode = mode.length > 0 ? mode : SpotMode.Other;
	}

	public viewState: IViewState = {
		mode: SpotMode.Other,
	};
}

interface IViewState {
	mode: SpotMode;
}
