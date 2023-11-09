import { Component, OnInit } from "@angular/core";
import { ConnectionStatusComponent } from "src/app/components/connection-status/connection-status.component";
import { HeimdallSignalrService } from "src/app/services/HeimdallSignalRService";

@Component({
	selector: "pph-component-tester",
	templateUrl: "./component-tester.component.html",
	styleUrls: ["./component-tester.component.scss"],
	imports: [ConnectionStatusComponent],
	standalone: true,
})
export class ComponentTesterComponent implements OnInit {
	public count: number = 0;

	public constructor(private _signalRSvc: HeimdallSignalrService) {}

	public ngOnInit() {
		this._signalRSvc.currentClientCount.subscribe((message: number) => {
			this.count = message;
		});
	}
}
