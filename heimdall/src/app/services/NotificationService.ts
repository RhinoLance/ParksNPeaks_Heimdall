import { Injectable } from "@angular/core";
import { StorageService } from "./StorageService";
import { Player } from "morse-player";

@Injectable({
	providedIn: "root",
})
export class NotificationService {
	private _config: INotificationSettings;

	public constructor(private _storageSvc: StorageService) {
		this.loadConfig();
	}

	public loadConfig() {
		let config = this._storageSvc.load<INotificationSettings>(
			"notificationSettings"
		);

		if (!config) {
			config = {
				audioType: AlertSound.Click,
			};
		}

		this._config = config;
	}

	public playAudioAlert(text?: string) {
		switch (this._config.audioType) {
			case AlertSound.Morse:
				this.playMorse(text);
				break;
			case AlertSound.BubbleUp:
				this.playFile("bubble-up.mp3");
				break;
			case AlertSound.Click:
				this.playFile("pen-click.mp3");
				break;
		}
	}

	public setAudioAlert(sound: AlertSound) {
		this._config.audioType = sound;
	}

	public getAlertSound(): AlertSound {
		return this._config.audioType;
	}

	private playFile(fileName: string) {
		const audio = new Audio();
		audio.volume = 0.7;
		audio.src = `assets/audio/alerts/${fileName}`;
		audio.load();
		audio.play();
	}

	private playMorse(text: string) {
		const player = new Player({
			volume: 0.7,
			gain: 0.5,
			freq: 650,
			q: 10,
			wpm: 30,
			eff: 30,
			color: "#fff",
		});

		player.play("  " + text);
	}
}

export enum AlertSound {
	None = "None",
	Morse = "Morse",
	BubbleUp = "Bubble Up",
	Click = "Click",
}

interface INotificationSettings {
	audioType: AlertSound;
}
