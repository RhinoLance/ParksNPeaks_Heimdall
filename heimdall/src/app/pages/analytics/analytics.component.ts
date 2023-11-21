import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HubUser } from "src/app/services/HeimdallSignalRService";
import { RealTimeUserService } from "src/app/services/RealTimeUserService";

@Component({
	selector: "pph-analytics",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./analytics.component.html",
	styleUrls: ["./analytics.component.scss"],
})
export class AnalyticsComponent {
	public viewModel: ViewModel = {
		userList: [],
	};

	public constructor(private _realTimeUserSvc: RealTimeUserService) {
		this.listenForUserUpdates();

		this.loadUsers();
	}

	private listenForUserUpdates(): void {
		this._realTimeUserSvc.connectionAdded.subscribe((user) => {
			this.upsertUser(user);
		});

		this._realTimeUserSvc.connectionRemoved.subscribe((user) => {
			this.viewModel.userList = this.viewModel.userList.filter(
				(v) => v.connectionId !== user.connectionId
			);
		});

		this._realTimeUserSvc.connectionStateChanged.subscribe(
			async (isConnected) => {
				if (isConnected) {
					this.loadUsers();
				}
			}
		);
	}

	private async loadUsers(): Promise<void> {
		if (!this._realTimeUserSvc.isConnected) return;

		const users = await this._realTimeUserSvc.getConnectedUsers();
		this.viewModel.userList = users;
	}

	private upsertUser(user: HubUser): void {
		const userRecord = this.viewModel.userList.find(
			(v) => v.connectionId === user.connectionId
		);
		if (userRecord == undefined) {
			this.viewModel.userList.push(user);
		} else {
			userRecord.userName = user.userName;
			userRecord.location = user.location;
		}
	}
}

type ViewModel = {
	userList: HubUser[];
};
