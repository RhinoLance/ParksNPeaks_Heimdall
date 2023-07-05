import { Component, Input, OnInit } from "@angular/core";
import { SpotMode } from "../models/SpotMode";

@Component({
	selector: "pph-mode-badge",
	templateUrl: "./mode-badge.component.html",
	styleUrls: ["./mode-badge.component.scss"],
})
export class ModeBadgeComponent implements OnInit {
	@Input() public mode!: SpotMode;

	public viewState: IViewState = {
		mode: SpotMode.SSB,
	};

	public ngOnInit(): void {
		this.viewState.mode = this.mode;
	}
}

interface IViewState {
	mode: SpotMode;
}
