import { Injectable } from "@angular/core";
import { StorageService } from "./StorageService";
import { Player } from "morse-player";
import { TPlayerOptions } from "morse-player/lib/libs/player";

@Injectable({
	providedIn: "root",
})
export class NotificationService {
	private _config: INotificationSettings;
	//private _audioContext: AudioContext = new AudioContext();

	private _audioPlayer: IMediaPlayer;
	private _morsePlayer: IMediaPlayer;

	private _mediaPlayers: IMediaPlayer[] = [];

	private _isEnabled: boolean;
	public get isEnabled(): boolean {
		return this._isEnabled;
	}

	public constructor(private _storageSvc: StorageService) {
		this.loadConfig();

		this.enableOnUserInteraction();
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
		if (!this._isEnabled) return;

		switch (this._config.audioType) {
			case AlertSound.Morse:
				this._morsePlayer.play(text);
				break;
			case AlertSound.BubbleUp:
				this._audioPlayer.play("assets/audio/alerts/bubble-up.mp3");
				break;
			case AlertSound.Click:
				this._audioPlayer.play("assets/audio/alerts/camera-shutter.mp3");
				break;
		}
	}

	public setAlertSound(sound: AlertSound) {
		this._config.audioType = sound;
		this.saveConfig();
	}

	public getAlertSound(): AlertSound {
		return this._config.audioType;
	}

	public setVolume(volume: number) {
		this._config.volume = volume;
		this.saveConfig();

		this._mediaPlayers.map((v) => v.setVolume(volume));
	}

	public getVolume(): number {
		return this._config.volume;
	}

	public enabled() {
		this._isEnabled = true;
	}

	public disabled() {
		this._isEnabled = false;
	}

	private enableOnUserInteraction() {
		const events = ["touchstart", "touchend", "mousedown", "keydown"];
		const unlock = () => {
			events.forEach(function (event) {
				document.body.removeEventListener(event, unlock);
			});

			this._isEnabled = true;

			this._audioPlayer = new AudioFilePlayer();
			this._morsePlayer = new MorsePlayer();

			this._mediaPlayers.push(this._audioPlayer, this._morsePlayer);

			//play a sound to trigger the audio context unlocking.
			const volume = this.getVolume();
			this.setVolume(0);
			this.playAudioAlert("e");

			setTimeout(() => {
				this.setVolume(volume);
			}, 2000);
		};

		events.forEach(function (event) {
			document.body.addEventListener(event, unlock, false);
		});
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

export class AudioFilePlayer implements IMediaPlayer {
	private _audioElement: HTMLAudioElement = new Audio();

	public constructor(private _audioContext?: AudioContext) {
		this._audioElement = new Audio();
		//const mediaSrc = this._audioContext.createMediaElementSource(this._audioElement);
		//mediaSrc.connect(this._audioContext.destination);
		this._audioElement.volume = 0.5;
	}

	public setSource(sourcePath: string) {
		this._audioElement.src = sourcePath;
		this._audioElement.load();
	}

	public play(url: string): void {
		this.setSource(url);
		this._audioElement.play();
	}

	public stop(): void {
		this._audioElement.pause();
	}

	public setVolume(volume: number) {
		this._audioElement.volume = volume / 100;
	}
}

export class MorsePlayer implements IMediaPlayer {
	private _player = new Player();

	public constructor(private _options?: TPlayerOptions) {
		this._player = new Player();

		if (!this._options) {
			this._options = {
				volume: 0.5,
				gain: 0.2,
				freq: 600,
				q: 10,
				wpm: 35,
				eff: 35,
				color: "#fff",
			};
		}
	}

	public play(text: string): void {
		this._player.play("  " + text, this._options);
	}

	public stop(): void {
		this._player.stop();
	}

	public setVolume(volume: number): void {
		this._options.volume = volume / 100;
	}
}

export interface IMediaPlayer {
	play(source: string): void;
	stop(): void;
	setVolume(volume: number): void;
}
