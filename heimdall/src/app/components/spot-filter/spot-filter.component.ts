import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { SpotMode } from "src/app/models/SpotMode";

@Component({
	selector: "pph-spot-filter",
	imports: [CommonModule, NgbDropdownModule],
	templateUrl: "./spot-filter.component.html",
	styleUrls: ["./spot-filter.component.scss"],
	standalone: true,
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
