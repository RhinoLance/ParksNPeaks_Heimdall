import { ChangeContext, NgxSliderModule } from "@angular-slider/ngx-slider";
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import {
	AlertSound,
	NotificationService,
} from "src/app/services/NotificationService";

@Component({
	selector: "pph-notification-manager",
	imports: [NgbDropdownModule, NgxSliderModule],
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
		volume: 50,
		volumeIcon: "",
	};

	public volumeSliderOptions = {
		floor: 0,
		ceil: 100,
		step: 1,
		hideLimitLabels: true,
		animate: false,
		hidePointerLabels: true,
	};

	public constructor(private _notificationSvc: NotificationService) {
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
		this.viewModel.volume = this._notificationSvc.getVolume();

		this.setVolumeIcon(this.viewModel.volume);
	}

	public setAlertSound(soundName: string) {
		const sound = AlertSound[soundName as keyof typeof AlertSound];

		this._notificationSvc.setAudioAlert(sound);
		this.viewModel.alertSound = sound;

		this.playTestSound();
	}

	public volumeChanged(changeContext: ChangeContext) {
		this._notificationSvc.setVolume(changeContext.value);
		this.viewModel.volume = changeContext.value;

		this.playTestSound();
	}

	public volumeChanging(changeContext: ChangeContext) {
		this.setVolumeIcon(changeContext.value);
	}

	private setVolumeIcon(level: number) {
		this.viewModel.volumeIcon =
			level === 0
				? "lineicons:volume-mute"
				: level < 33
				? "lineicons:volume-low"
				: level < 66
				? "lineicons:volume-1"
				: "lineicons:volume-high";
	}

	private playTestSound() {
		this._notificationSvc.playAudioAlert("C");
	}
}

interface IViewModel {
	alertSound: AlertSound;
	soundOptions: string[];
	volume: number;
	volumeIcon: string;
}
