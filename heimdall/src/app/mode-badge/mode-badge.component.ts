import { Component, Input, OnInit } from "@angular/core";
import { SpotMode } from "../models/SpotMode";

@Component({
	selector: "pph-mode-badge",
	templateUrl: "./mode-badge.component.html",
	styleUrls: ["./mode-badge.component.scss"],
	standalone: true,
})
export class ModeBadgeComponent {
	@Input() set mode(string: SpotMode) {
		this.viewState.mode = string;
	}

	public viewState: IViewState = {
		mode: SpotMode.SSB,
	};
}

interface IViewState {
	mode: SpotMode;
}
