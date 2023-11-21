import { Inject, Injectable } from "@angular/core";
import {
	HubConnection,
	HubConnectionBuilder,
	LogLevel,
} from "@microsoft/signalr";
import { NAVIGATOR, WINDOW } from "@ng-web-apis/common";
import { retryBackoff } from "backoff-rxjs";
import { BehaviorSubject, Subject, finalize, from, timer } from "rxjs";
import { environment } from "src/environments/environment";
import { LatLng } from "../models/LatLng";

@Injectable({
	providedIn: "root",
})
export class HeimdallSignalrService {
	private _hubUrl: string;
	private _connection: HubConnection;
	private _isConnecting: boolean = false;

	private _cnsl: Console = console;

	public readonly helloHubMessage = new BehaviorSubject<string>("");
	public readonly currentClientCount = new BehaviorSubject<number>(0);
	public readonly connectionAdded = new Subject<HubUser>();
	public readonly connectionRemoved = new Subject<HubUser>();
	public readonly connectionStateChanged = new BehaviorSubject<boolean>(false);

	public get isConnected(): boolean {
		return this.connectionStateChanged.value;
	}

	public constructor(
		@Inject(WINDOW) private _window: Window,
		@Inject(NAVIGATOR) private _navigator: Navigator
	) {
		this._hubUrl = environment.heimdallHubUrl;

		this._connection = this.initiateSignalrConnection();
		this.registerSignalrClientMethods();

		this._window.addEventListener("online", () => {
			if (!this.isConnected) {
				this.connect();
			}
		});
	}

	private initiateSignalrConnection(): HubConnection {
		const connection = new HubConnectionBuilder()
			.withUrl(this._hubUrl, {
				withCredentials: false,
			})
			//.withAutomaticReconnect()
			.configureLogging(LogLevel.Information)
			.build();

		return connection;
	}

	public connect(): void {
		if (this._isConnecting) return;

		this._isConnecting = true;

		from(this._connection.start())
			.pipe(
				retryBackoff({
					initialInterval: 1000,
					shouldRetry: () => this._navigator.onLine,
					maxRetries: 5,
				}),
				finalize(() => (this._isConnecting = false))
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
		this._connection.on("ClientCount", (count: number) => {
			this.currentClientCount.next(count);
		});

		this._connection.on("DisplayMessage", (message: string) => {
			this.helloHubMessage.next(message);
		});

		this._connection.on("ConnectionAdded", (connection: HubUser) => {
			this.connectionAdded.next(connection);
		});

		this._connection.on("ConnectionRemoved", (connection: HubUser) => {
			this.connectionRemoved.next(connection);
		});

		this._connection.onclose(() => {
			this.onDisconnected();
		});
	}

	private onConnected(): void {
		this.connectionStateChanged.next(true);

		this._cnsl.log(
			`SignalR connection success! connectionId: ${this._connection.connectionId}`
		);
	}

	private onDisconnected(): void {
		this.connectionStateChanged.next(false);
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
		this._connection.invoke<void>(
			"SetUserDetails",
			this._connection.connectionId,
			name,
			location.lat,
			location.lng
		);
	}

	public async getConnectedUsers(): Promise<HubUser[]> {
		return this._connection.invoke<HubUser[]>("GetUsers");
	}
}

export type HubUser = {
	connectionId: string;
	userName: string;
	location: LatLng;
};
