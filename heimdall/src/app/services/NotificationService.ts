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

	private loadConfig() {
		let config = this._storageSvc.load<INotificationSettings>(
			"notificationSettings"
		);

		if (!config) {
			config = {
				audioType: AlertSound.Click,
				volume: 50,
			};
		}

		this._config = config;
	}

	private saveConfig() {
		this._storageSvc.save("notificationSettings", this._config);
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
		this.saveConfig();
	}

	public setVolume(volume: number) {
		this._config.volume = volume;
		this.saveConfig();
	}

	public getAlertSound(): AlertSound {
		return this._config.audioType;
	}

	public getVolume(): number {
		return this._config.volume;
	}

	private playFile(fileName: string) {
		const audio = new Audio();
		audio.volume = this._config.volume / 100;
		audio.src = `assets/audio/alerts/${fileName}`;
		audio.load();
		audio.play();
	}

	private playMorse(text: string) {
		const player = new Player({
			volume: this._config.volume / 100,
			gain: 0.5,
			freq: 850,
			q: 10,
			wpm: 35,
			color: "#fff",
		});

		player.play("  " + text, { volume: 0.2, freq: 850 });
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
	volume: number;
}
