import { Component, OnDestroy } from "@angular/core";
import { ActivationCatalogue } from "src/app/models/ActivationCatalogue";
import { TimeUpdator } from "src/app/models/TimeUpdator";
import { Activation } from "src/app/models/Activation";
import { PnPClientService } from "src/app/services/PNPHttpClient.service";

@Component({
	selector: "pph-spot-list",
	templateUrl: "./spot-list.component.html",
	styleUrls: ["./spot-list.component.scss"],
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
			this.viewState.activationList = this._spotCalatogue.activations;

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
