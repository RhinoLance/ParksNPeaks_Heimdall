import { CommonModule } from "@angular/common";
import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Spot } from "src/app/models/Spot";
import { SpotMode, spotModeList } from "src/app/models/SpotMode";
import { ModeBadgeComponent } from "../mode-badge/mode-badge.component";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DataService } from "src/app/services/DataService";
import { MatTooltipModule } from "@angular/material/tooltip";
import { finalize } from "rxjs";

@Component({
	selector: "pph-respot",
	templateUrl: "./respot.component.html",
	styleUrls: ["./respot.component.scss"],
	standalone: true,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		CommonModule,
		FormsModule,
		ModeBadgeComponent,
		NgbDropdownModule,
		MatTooltipModule,
	],
})
export class RespotComponent implements OnInit {
	@Input() public spot!: Spot;

	@Output() public respotSent = new EventEmitter<boolean>();

	public viewModel!: ViewModel;

	public viewState: ViewState = {
		isSending: false,
		sendError: false,
	};

	public constructor(private _dataSvc: DataService) {}

	public ngOnInit(): void {
		this.viewModel = {
			modeList: spotModeList,
			spot: this.spot,
		};
	}

	public setFrequency($event: Event) {
		const freq = parseFloat(($event.target as HTMLInputElement).value);

		this.spot.frequency = freq > 100000 ? freq / 1000 : freq;
	}

	public sendReSpot(): void {
		if (this.viewState.isSending) return;

		this.viewState.isSending = true;
		this.viewState.sendError = false;

		this._dataSvc
			.submitSpot(this.spot)
			.pipe(finalize(() => (this.viewState.isSending = false)))
			.subscribe({
				complete: () => {
					this.respotSent.emit(true);
				},
				error: () => {
					this.viewState.sendError = true;
					this.respotSent.emit(false);
				},
			});
	}
}

type ViewModel = {
	modeList: SpotMode[];
	spot: Spot;
};

type ViewState = {
	isSending: boolean;
	sendError: boolean;
};
