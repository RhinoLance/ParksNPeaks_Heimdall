import { ActivationCatalogue } from "./ActivationCatalogue";

export class TimeUpdator {
	private _updateTimeout?: ReturnType<typeof setInterval>;
	private _dateProvider: TimeUpdatorDate;
	private _updateMinutes: number;

	public constructor(
		private _activationCatalogue: ActivationCatalogue,
		private updateMinutes?: number,
		private dateProvider?: TimeUpdatorDate
	) {
		this._updateMinutes = updateMinutes || 1;
		this._dateProvider = dateProvider || new TimeUpdatorDate();
	}

	private updateTMinus(): void {
		const spots = this._activationCatalogue.activations
			.map((v) => v.spots)
			.flat();

		const now = this._dateProvider.currentTimeStamp();

		spots.map((v) => {
			v.tPlusMinutes = Math.round((now - v.time.getTime()) / 1000 / 60);
		});
	}

	public start(): void {
		this.updateTMinus();

		const intervalTime = this._updateMinutes;
		this._updateTimeout = setInterval(() => {
			this.updateTMinus();
		}, intervalTime * 60 * 1000);
	}

	public stop(): void {
		if (this._updateTimeout == null) return;

		clearInterval(this._updateTimeout);
	}
}

export class TimeUpdatorDate {
	public currentTimeStamp(): number {
		return Date.now();
	}
}
