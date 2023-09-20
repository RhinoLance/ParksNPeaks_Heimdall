import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Spot } from "src/app/models/Spot";
import { SpotMode, spotModeList } from "src/app/models/SpotMode";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
	selector: "pph-create-spot",
	templateUrl: "./create-spot.component.html",
	styleUrls: ["./create-spot.component.scss"],
	standalone: true,
	imports: [CommonModule, FormsModule],
})
export class CreateSpotComponent {
	public viewModel: ViewModel;

	public constructor(
		@Inject(MAT_DIALOG_DATA) public data: CreateSpotComponentData
	) {
		this.viewModel = {
			modeList: spotModeList,
			spot: data.spot ?? new Spot(),
			isRespot: data.isRespot,
		};
	}

	public addSpot() {
		//console.log("submit");
	}

	public discard() {
		//console.log("discard");
	}

	private populateAwardList() {
		throw new Error("Method not implemented.");
	}
}

type ViewModel = {
	modeList: SpotMode[];
	spot: Spot;
	isRespot: boolean;
};

type CreateSpotComponentData = {
	spot?: Spot;
	isRespot: boolean;
};
