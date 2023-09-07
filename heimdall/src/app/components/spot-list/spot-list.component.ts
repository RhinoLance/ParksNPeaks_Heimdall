import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivationCatalogue } from "src/app/models/ActivationCatalogue";
import { TimeUpdator } from "src/app/models/TimeUpdator";
import { Activation } from "src/app/models/Activation";
import { PnPClientService } from "src/app/services/PNPHttpClient.service";
import { ActivationComponent } from "../activation/activation.component";
import { NgFor } from "@angular/common";

@Component({
	selector: "pph-spot-list",
	templateUrl: "./spot-list.component.html",
	styleUrls: ["./spot-list.component.scss"],
	standalone: true,
	imports: [NgFor, ActivationComponent],
})
export class SpotListComponent implements OnDestroy, OnInit {
	public viewState: ViewState = {
		activationList: [],
	};

	private _activationCalatogue: ActivationCatalogue = new ActivationCatalogue();
	private _spotTimeUpdator: TimeUpdator = new TimeUpdator(
		this._activationCalatogue
	);

	private _spotAddedCouner: number = 0;

	public constructor(private _pnpClient: PnPClientService) {}

	public ngOnInit(): void {
		this._pnpClient.subscribeToSpots(1).subscribe((spots) => {
			if (this._spotAddedCouner >= spots.length) {
				return;
			}

			spots = [spots[spots.length - (this._spotAddedCouner + 1)]];

			this._spotAddedCouner++;

			this._activationCalatogue.addSpots(spots);

			const activationList = this._activationCalatogue.activations;
			activationList.sort((a, b) => {
				return (
					b.getLatestSpot().time.getTime() - a.getLatestSpot().time.getTime()
				);
			});

			//this.viewState.activationList.length = 0;
			this.viewState.activationList = activationList;

			//this._spotTimeUpdator.start();
		});
	}

	public ngOnDestroy(): void {
		this._spotTimeUpdator.stop();
	}
}

interface ViewState {
	activationList: Activation[];
}
