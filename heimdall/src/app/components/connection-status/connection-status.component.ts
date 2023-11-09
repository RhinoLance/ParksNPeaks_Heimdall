import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeimdallSignalrService } from "src/app/services/HeimdallSignalRService";

@Component({
	selector: "pph-connection-status",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./connection-status.component.html",
	styleUrls: ["./connection-status.component.scss"],
})
export class ConnectionStatusComponent implements OnInit {
	public viewState: ViewState = {
		count: 0,
		isOnline: false,
		statusText: "Offline",
	};

	public constructor(private _signalRSvc: HeimdallSignalrService) {}

	public ngOnInit() {
		this._signalRSvc.currentClientCount.subscribe((count: number) => {
			this.viewState.count = count;
		});

		this._signalRSvc.connectionState.subscribe((isConnected: boolean) => {
			this.viewState.isOnline = isConnected;
			this.setOnlineStateMessage(isConnected);
		});
	}

	private setOnlineStateMessage(isOnline: boolean): string {
		return (this.viewState.statusText = isOnline
			? "Live"
			: "Reconnecting . . .");
	}
}

type ViewState = {
	count: number;
	isOnline: boolean;
	statusText: string;
};
