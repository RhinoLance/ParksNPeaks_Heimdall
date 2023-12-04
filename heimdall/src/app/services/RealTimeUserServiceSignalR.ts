import { Observable } from "rxjs";
import { HeimdallSignalrService, HubUser } from "./HeimdallSignalRService";
import { RealTimeUserService } from "./RealTimeUserService";
import { LatLng } from "../models/LatLng";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class RealTimeUserServiceSignalR extends RealTimeUserService {
	public constructor(private _heimdallSignalRSvc: HeimdallSignalrService) {
		super();
	}

	public get isConnected(): boolean {
		return this._heimdallSignalRSvc.isConnected;
	}
	public get connectionStateChanged(): Observable<boolean> {
		return this._heimdallSignalRSvc.connectionStateChanged;
	}
	public get connectionAdded(): Observable<HubUser> {
		return this._heimdallSignalRSvc.connectionAdded;
	}
	public get connectionRemoved(): Observable<HubUser> {
		return this._heimdallSignalRSvc.connectionRemoved;
	}
	public get currentClientCount(): Observable<number> {
		return this._heimdallSignalRSvc.currentClientCount;
	}
	public updateUserDetails(name: string, location: LatLng): void {
		return this._heimdallSignalRSvc.updateUserDetails(name, location);
	}
	public getConnectedUsers(): Promise<HubUser[]> {
		return this._heimdallSignalRSvc.getConnectedUsers();
	}

	public init(): void {
		this._heimdallSignalRSvc.connect();
	}
}
