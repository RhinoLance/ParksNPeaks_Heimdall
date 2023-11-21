import { Observable } from "rxjs";
import { HubUser } from "./HeimdallSignalRService";
import { LatLng } from "../models/LatLng";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export abstract class RealTimeUserService {
	public constructor() {}

	public abstract readonly isConnected: boolean;
	public abstract readonly connectionStateChanged: Observable<boolean>;
	public abstract readonly connectionAdded: Observable<HubUser>;
	public abstract readonly connectionRemoved: Observable<HubUser>;
	public abstract readonly currentClientCount: Observable<number>;
	public abstract updateUserDetails(name: string, location: LatLng): void;
	public abstract getConnectedUsers(): Promise<HubUser[]>;
	public abstract init(): void;
}
