import { Component, OnInit } from "@angular/core";
import { Activation } from "src/app/models/Activation";
import { ActivationComponent } from "../activation/activation.component";
import { CommonModule } from "@angular/common";
import { NoSpotsComponent } from "../no-spots/no-spots.component";
import { RaysDirective } from "../../directives/rays.directive";
import { DataService } from "src/app/services/DataService";

@Component({
	selector: "pph-spot-list",
	templateUrl: "./spot-list.component.html",
	styleUrls: ["./spot-list.component.scss"],
	standalone: true,
	imports: [CommonModule, NoSpotsComponent, RaysDirective, ActivationComponent],
})
export class SpotListComponent implements OnInit {
	public viewState: ViewState = {
		activationList: [],
		visibleActivationCount: 0,
	};

	public constructor(private _dataSvc: DataService) {}

	public ngOnInit(): void {
		this._dataSvc.activationUpdated.subscribe(() => {
			const activationList = this._dataSvc.getActivations();
			activationList.sort((a, b) => {
				return (
					b.getLatestSpot().time.getTime() - a.getLatestSpot().time.getTime()
				);
			});

			this.viewState.activationList = activationList;
		});
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
