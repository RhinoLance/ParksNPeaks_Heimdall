import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: "root",
})
export class HeimdallSignalrService {
	private hubUrl: string;
	public connection!: signalR.HubConnection;

	private _cnsl: Console = console;

	public helloHubMessage: BehaviorSubject<string> = new BehaviorSubject<string>(
		""
	);
	public currentClientCount: BehaviorSubject<number> =
		new BehaviorSubject<number>(0);

	public constructor() {
		this.hubUrl = environment.heimdallHubUrl;
	}

	public async initiateSignalrConnection(): Promise<void> {
		try {
			this.connection = new signalR.HubConnectionBuilder()
				.withUrl(this.hubUrl, {
					withCredentials: false,
				})
				.withAutomaticReconnect()
				.configureLogging(signalR.LogLevel.Trace)
				.build();

			await this.connection.start();
			this.setSignalrClientMethods();

			this._cnsl.log(
				`SignalR connection success! connectionId: ${this.connection.connectionId}`
			);
		} catch (error) {
			this._cnsl.error(`SignalR connection error: ${error}`);
		}
	}

	public hello(): void {
		this.connection.invoke("Hello");
	}

	private setSignalrClientMethods(): void {
		this.connection.on("DisplayMessage", (message: string) => {
			this.helloHubMessage.next(message);
		});

		this.connection.on("ClientCount", (count: number) => {
			this.currentClientCount.next(count);
		});
	}
}
