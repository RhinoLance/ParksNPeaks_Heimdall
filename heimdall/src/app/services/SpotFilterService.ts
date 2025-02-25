import { Injectable } from "@angular/core";
import { AwardScheme } from "../models/AwardScheme";
import { SpotMode } from "../models/SpotMode";
import { IFrequencyBand } from "../models/Bands";
import { debounceTime, Subject } from "rxjs";
import { StorageService } from "./StorageService";

@Injectable({
	providedIn: "root",
})
export class SpotFilterService {
	private _awardSchemes: AwardScheme[] = [];
	private _spotModes: SpotMode[] = [];
	private _bands: IFrequencyBand[] = [];

	public get awardSchemes(): AwardScheme[] {
		return this._awardSchemes;
	}
	public get spotModes(): SpotMode[] {
		return this._spotModes;
	}
	public get bands(): IFrequencyBand[] {
		return this._bands;
	}

	public filtersChanged: Subject<FilterType> = new Subject<FilterType>();
	private _pendingSave: Subject<void> = new Subject<void>();

	/**
	 *
	 */
	constructor(private _storageSvc: StorageService) {
		this.configureSave();
		this.loadFilters();
	}

	public setAwardSchemes(schemes: AwardScheme[]): void {
		this._awardSchemes = schemes;
		this.filtersChanged.next(FilterType.Schemes);
	}

	public setSpotModes(modes: SpotMode[]): void {
		this._spotModes = modes;
		this.filtersChanged.next(FilterType.Modes);
	}

	public setBands(bands: IFrequencyBand[]): void {
		this._bands = bands;
		this.filtersChanged.next(FilterType.Bands);
	}

	private loadFilters(): void {
		const data = this._storageSvc.load<IStorageModel>("spotFilter");

		if (data == undefined) return;

		this._awardSchemes = data.awardSchemes;
		this._spotModes = data.spotModes;
		this._bands = data.bands;
	}

	private configureSave(): void {
		this.filtersChanged
			.pipe(debounceTime(1000))
			.subscribe(() => this.saveFilters());
	}

	private saveFilters(): void {
		const data: IStorageModel = {
			awardSchemes: this._awardSchemes,
			spotModes: this._spotModes,
			bands: this._bands,
		};

		this._storageSvc.save("spotFilter", data);
	}
}

export enum FilterType {
	Modes,
	Bands,
	Schemes,
}

interface IStorageModel {
	awardSchemes: AwardScheme[];
	spotModes: SpotMode[];
	bands: IFrequencyBand[];
}
