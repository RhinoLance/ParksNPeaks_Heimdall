import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { ModeBadgeComponent } from "../mode-badge/mode-badge.component";
import { SpotMode } from "src/app/models/SpotMode";

@Component({
	selector: "pph-spot-filter",
	standalone: true,
	imports: [CommonModule, NgbDropdownModule, ModeBadgeComponent],
	templateUrl: "./spot-filter.component.html",
	styleUrls: ["./spot-filter.component.scss"],
})
export class SpotFilterComponent {
	public modeList: SpotMode[] = [
		SpotMode.AM,
		SpotMode.CW,
		SpotMode.DATA,
		SpotMode.FM,
		SpotMode.SSB,
	];
}
