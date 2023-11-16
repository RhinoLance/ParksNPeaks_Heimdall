import { Inject, Injectable } from "@angular/core";
import {
	HubConnection,
	HubConnectionBuilder,
	LogLevel,
} from "@microsoft/signalr";
import { NAVIGATOR, WINDOW } from "@ng-web-apis/common";
import { retryBackoff } from "backoff-rxjs";
import { BehaviorSubject, finalize, from, map, tap, timer } from "rxjs";
import { environment } from "src/environments/environment";
import { LatLng } from "../models/LatLng";

@Injectable({
	providedIn: "root",
})
export class HeimdallSignalrService {
	private hubUrl: string;
	private connection: HubConnection;
	private isConnecting: boolean = false;

	private _cnsl: Console = console;

	public helloHubMessage = new BehaviorSubject<string>("");
	public currentClientCount = new BehaviorSubject<number>(0);

	public connectionState = new BehaviorSubject<boolean>(false);

	public get isConnected(): boolean {
		return this.connectionState.value;
	}

	public constructor(
		@Inject(WINDOW) private _window: Window,
		@Inject(NAVIGATOR) private _navigator: Navigator
	) {
		this.hubUrl = environment.heimdallHubUrl;

		this.connection = this.initiateSignalrConnection();
		this.registerSignalrClientMethods();

		this._window.addEventListener("online", () => {
			if (!this.isConnected) {
				this.connect();
			}
		});
	}

	private initiateSignalrConnection(): HubConnection {
		const connection = new HubConnectionBuilder()
			.withUrl(this.hubUrl, {
				withCredentials: false,
			})
			//.withAutomaticReconnect()
			.configureLogging(LogLevel.Information)
			.build();

		return connection;
	}

	public connect(): void {
		if (this.isConnecting) return;

		this.isConnecting = true;

		from(this.connection.start())
			.pipe(
				retryBackoff({
					initialInterval: 1000,
					shouldRetry: () => this._navigator.onLine,
					maxRetries: 5,
				}),
				finalize(() => (this.isConnecting = false))
			)
			.subscribe({
				next: () => this.onConnected(),
				error: (err) => {
					this._cnsl.log(err + "SignalR connection failed.");

					this.scheduleReconnect();
				},
			});
	}

	private registerSignalrClientMethods(): void {
		this.connection.on("ClientCount", (count: number) => {
			this.currentClientCount.next(count);
		});

		this.connection.on("DisplayMessage", (message: string) => {
			this.helloHubMessage.next(message);
		});

		this.connection.onclose(() => {
			this.onDisconnected();
		});
	}

	private onConnected(): void {
		this.connectionState.next(true);

		this._cnsl.log(
			`SignalR connection success! connectionId: ${this.connection.connectionId}`
		);
	}

	private onDisconnected(): void {
		this.connectionState.next(false);
		this._cnsl.log("SignalR connection disconnected.");

		this.connect();
	}

	private scheduleReconnect(): void {
		if (this._navigator.onLine) {
			timer(1000 * 60).subscribe(() => this.connect());
			this._cnsl.log("Will try to reconnect in 60 seconds ...");
		} else {
			this._cnsl.log("Will try to reconnect when back online ...");
		}
	}

	public updateUserDetails(name: string, location: LatLng): void {
		this.connection.invoke<void>(
			"SetUserDetails",
			this.connection.connectionId,
			name,
			location.lat,
			location.lng
		);
	}
}
