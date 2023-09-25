import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Spot } from "src/app/models/Spot";
import { SpotMode, spotModeList } from "src/app/models/SpotMode";
import { ModeBadgeComponent } from "../mode-badge/mode-badge.component";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { PnPClientService } from "src/app/services/PNPHttpClient.service";

@Component({
	selector: "pph-respot",
	templateUrl: "./respot.component.html",
	styleUrls: ["./respot.component.scss"],
	standalone: true,
	imports: [CommonModule, FormsModule, ModeBadgeComponent, NgbDropdownModule],
})
export class RespotComponent implements OnInit {
	@Input() public spot!: Spot;

	public viewModel!: ViewModel;

	public constructor(private _pnpClientSvc: PnPClientService) {}

	public ngOnInit(): void {
		this.viewModel = {
			modeList: spotModeList,
			spot: this.spot,
			newFrequency: 0,
		};
	}

	public addSpot() {
		this.spot.frequency =
			this.viewModel.newFrequency > 100000
				? this.viewModel.newFrequency / 1000
				: this.viewModel.newFrequency;

		this._pnpClientSvc.submitSpot(this.spot).subscribe();
	}
}

type ViewModel = {
	modeList: SpotMode[];
	spot: Spot;
	newFrequency: number;
};
