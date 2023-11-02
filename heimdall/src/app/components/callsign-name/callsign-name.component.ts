import { CommonModule } from "@angular/common";
import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	ElementRef,
	Input,
	OnInit,
	ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Subscription, mergeMap, timer } from "rxjs";
import { CallsignDetails } from "src/app/models/CallsignDetails";
import { DataService } from "src/app/services/DataService";

@Component({
	selector: "pph-callsign-name",
	templateUrl: "./callsign-name.component.html",
	styleUrls: ["./callsign-name.component.scss"],
	standalone: true,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [CommonModule, FormsModule],
})
export class CallsignNameComponent implements OnInit {
	@Input() public callsign: string = "";

	@ViewChild("nameInput") public input: ElementRef | undefined;

	public viewState: ViewState = {
		newName: "",
		canEdit: false,
		callsignDetails: {
			name: "",
			callsign: "",
		},
		showEdit: false,
	};

	private _submitSub: Subscription | undefined;

	public constructor(private _dataSvc: DataService) {
		this.viewState.canEdit = this._dataSvc.canUpdateCallsignDetails;
	}

	public ngOnInit(): void {
		this.viewState.callsignDetails.callsign = this.callsign;
		this.retrieveCallsignDetails();
	}

	public showEdit() {
		this.viewState.newName = this.viewState.callsignDetails.name;

		this.viewState.showEdit = true;
		if (this._submitSub != undefined) this._submitSub.unsubscribe();

		if (this.input != undefined)
			timer(50).subscribe(() => this.input!.nativeElement.focus());
	}

	public updateName(name: string) {
		this.viewState.showEdit = false;

		if (name.length == 0) return;

		if (name == this.viewState.callsignDetails!.name) {
			return;
		}

		this.viewState.callsignDetails.name = name;

		this._submitSub = timer(1000)
			.pipe(
				mergeMap(() =>
					this._dataSvc.updateUserDetails(
						new CallsignDetails(this.callsign, name, "", new Date())
					)
				)
			)
			.subscribe();
	}

	public keyPress(event: KeyboardEvent) {
		switch (event.key) {
			case "Escape":
				this.viewState.showEdit = false;
				break;

			case "Enter":
				event.preventDefault();
				this.updateName(this.viewState.newName || "");
				break;

			default:
				return;
		}
	}

	private retrieveCallsignDetails(): void {
		this._dataSvc.getUserDetails(this.callsign).subscribe((v) => {
			this.viewState.callsignDetails.name =
				v == undefined ? "Unknown name" : v.name;
		});
	}
}

type ViewState = {
	newName: string;
	callsignDetails: {
		name: string;
		callsign: string;
	};
	canEdit: boolean;
	showEdit: boolean;
};
