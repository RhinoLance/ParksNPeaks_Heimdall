import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Spot } from "src/app/models/Spot";
import { SpotMode, spotModeList } from "src/app/models/SpotMode";
import { ModeBadgeComponent } from "../mode-badge/mode-badge.component";
//import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: "pph-respot",
	templateUrl: "./respot.component.html",
	styleUrls: ["./respot.component.scss"],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ModeBadgeComponent,
		//NgbDropdownModule
	],
})
export class RespotComponent implements OnInit {
	@Input() public spot!: Spot;

	public viewModel!: ViewModel;

	public ngOnInit(): void {
		this.viewModel = {
			modeList: spotModeList,
			spot: this.spot ?? new Spot(),
		};
	}

	public addSpot() {
		//console.log("submit");
	}

	public discard() {
		//console.log("discard");
	}
}

type ViewModel = {
	modeList: SpotMode[];
	spot: Spot;
};
