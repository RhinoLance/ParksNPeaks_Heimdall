import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import {
	AlertSound,
	NotificationService,
} from "src/app/services/NotificationService";

@Component({
	selector: "pph-notification-manager",
	imports: [NgbDropdownModule],
	templateUrl: "./notification-manager.component.html",
	styleUrl: "./notification-manager.component.scss",
	standalone: true,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotificationManagerComponent {
	public AlertSound = AlertSound;

	public viewModel: IViewModel = {
		alertSound: AlertSound.None,
		soundOptions: [],
	};

	private constructor(private _notificationSvc: NotificationService) {
		this.setSoundOptions();

		this.viewModel.alertSound = this._notificationSvc.getAlertSound();
	}

	private setSoundOptions() {
		for (const sound in AlertSound) {
			if (sound == "None") continue;

			this.viewModel.soundOptions.push(sound);
			this.viewModel.soundOptions.sort();
		}

		this.viewModel.alertSound = this._notificationSvc.getAlertSound();
	}

	public setAlertSound(soundName: string) {
		const sound = AlertSound[soundName as keyof typeof AlertSound];

		this._notificationSvc.setAudioAlert(sound);
		this.viewModel.alertSound = sound;

		this._notificationSvc.playAudioAlert("C");
	}

	public test() {
		this._notificationSvc.playAudioAlert("C");
	}
}

interface IViewModel {
	alertSound: AlertSound;
	soundOptions: string[];
}
