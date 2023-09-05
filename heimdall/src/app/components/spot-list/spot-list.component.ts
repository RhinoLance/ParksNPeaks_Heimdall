import { Component, OnDestroy } from "@angular/core";
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
export class SpotListComponent implements OnDestroy {
	public viewState: ViewState = {
		activationList: [],
	};

	private _spotCalatogue: ActivationCatalogue = new ActivationCatalogue();
	private _spotTimeUpdator: TimeUpdator = new TimeUpdator(this._spotCalatogue);

	public constructor(_pnpClient: PnPClientService) {
		_pnpClient.subscribeToSpots(1).subscribe((spots) => {
			this._spotCalatogue.addSpots(spots);

			const activationList = this._spotCalatogue.activations;
			activationList.sort((a, b) => {
				return (
					b.getLatestSpot().time.getTime() - a.getLatestSpot().time.getTime()
				);
			});

			this.viewState.activationList = activationList;

			this._spotTimeUpdator.start();
		});
	}

	public ngOnDestroy(): void {
		this._spotTimeUpdator.stop();
	}
}

interface ViewState {
	activationList: Activation[];
}
