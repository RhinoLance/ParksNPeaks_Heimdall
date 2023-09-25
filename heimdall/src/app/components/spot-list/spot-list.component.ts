import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivationCatalogue } from "src/app/models/ActivationCatalogue";
import { TimeUpdator } from "src/app/models/TimeUpdator";
import { Activation } from "src/app/models/Activation";
import { PnPClientService } from "src/app/services/PNPHttpClient.service";
import { ActivationComponent } from "../activation/activation.component";
import { CommonModule } from "@angular/common";
import { NoSpotsComponent } from "../no-spots/no-spots.component";
import { RaysDirective } from "../../directives/rays.directive";

@Component({
	selector: "pph-spot-list",
	templateUrl: "./spot-list.component.html",
	styleUrls: ["./spot-list.component.scss"],
	standalone: true,
	imports: [CommonModule, NoSpotsComponent, RaysDirective, ActivationComponent],
})
export class SpotListComponent implements OnDestroy, OnInit {
	public viewState: ViewState = {
		activationList: [],
		visibleActivationCount: 0,
	};

	private _activationCalatogue: ActivationCatalogue = new ActivationCatalogue();
	private _spotTimeUpdator: TimeUpdator = new TimeUpdator(
		this._activationCalatogue
	);

	public constructor(private _pnpClientSvc: PnPClientService) {}

	public ngOnInit(): void {
		this._pnpClientSvc.subscribeToSpots(1).subscribe((spots) => {
			this._activationCalatogue.addSpots(spots);

			const activationList = this._activationCalatogue.activations;
			activationList.sort((a, b) => {
				return (
					b.getLatestSpot().time.getTime() - a.getLatestSpot().time.getTime()
				);
			});

			this.viewState.activationList = activationList;
		});
	}

	public ngOnDestroy(): void {
		this._spotTimeUpdator.stop();
	}

	public onActivationShow(): void {
		this.viewState.visibleActivationCount++;
	}

	public onActivationHide(): void {
		this.viewState.visibleActivationCount--;
	}
}

interface ViewState {
	activationList: Activation[];
	visibleActivationCount: number;
}
