import { BehaviorSubject, Observable, Subject } from "rxjs";
import { LatLng } from "../models/LatLng";
import { HubUser } from "./HeimdallSignalRService";
import { RealTimeUserService } from "./RealTimeUserService";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class RealTimeUserServiceMock extends RealTimeUserService {
	public isConnected: boolean = true;
	public connectionStateChanged: Observable<boolean> =
		new BehaviorSubject<boolean>(true);
	public connectionAdded: Observable<HubUser> = new Subject<HubUser>();
	public connectionRemoved: Observable<HubUser> = new Subject<HubUser>();
	public currentClientCount = new BehaviorSubject<number>(4);

	private _hubUsers: HubUser[] = [
		{
			connectionId: "1",
			userName: "VK7ZA",
			location: new LatLng(-37.057, 143.411),
		},
		{
			connectionId: "2",
			userName: "VK2IO",
			location: new LatLng(-35.788, 149.0228),
		},
		{
			connectionId: "3",
			userName: "VK3PF",
			location: new LatLng(-37.6417, 148.3147),
		},
		{
			connectionId: "4",
			userName: "VK5PAS",
			location: new LatLng(-37.0655, 143.42),
		},
	];

	public updateUserDetails(name: string, location: LatLng): void {
		const user = this._hubUsers.find((u) => u.userName === name);
		(<Subject<HubUser>>this.connectionAdded).next({
			connectionId: user.connectionId,
			userName: name,
			location: location,
		});
	}

	public getConnectedUsers(): Promise<HubUser[]> {
		return Promise.resolve(this._hubUsers);
	}

	public init(): void {}
}
