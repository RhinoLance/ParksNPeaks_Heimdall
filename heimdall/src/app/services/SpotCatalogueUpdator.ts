import { ActivationCatalogue } from "../models/ActivationCatalogue";

export class SpotCatalogueUpdator {
	private _updateTimeout?: ReturnType<typeof setInterval>;

	public constructor(
		private _spotCatalogue: ActivationCatalogue,
		private _updateMinutes?: number
	) {}

	private updateTMinus(): void {
		/*
		const spots = this._spotCatalogue.getSpots();

		spots.map((v) => {
			v.tPlusMinutes = Math.round((now - v.time.getTime()) / 1000 / 60);
			Date.now();
		});
		*/
	}

	public start(): void {
		this.updateTMinus();

		//this._updateTimeout = window.setInterval( ()=> this.updateTMinus, this._updateMinutes ?? 1 * 1000 * 60 );
		this._updateTimeout = setInterval(() => {
			this.updateTMinus();
		}, 5000);
	}

	public stop(): void {
		if (this._updateTimeout == null) return;

		clearInterval(this._updateTimeout);
	}
}
