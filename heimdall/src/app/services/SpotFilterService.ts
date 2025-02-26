import { Injectable } from "@angular/core";
import { AwardScheme } from "../models/AwardScheme";
import { SpotMode } from "../models/SpotMode";
import { Band } from "../models/Band";
import { debounceTime, Subject } from "rxjs";
import { StorageService } from "./StorageService";

@Injectable({
	providedIn: "root",
})
export class SpotFilterService {
	private _awardSchemes: AwardScheme[] = [];
	private _spotModes: SpotMode[] = [];
	private _bands: Band[] = [];

	public get awardSchemes(): AwardScheme[] {
		return this._awardSchemes;
	}
	public get spotModes(): SpotMode[] {
		return this._spotModes;
	}
	public get bands(): Band[] {
		return this._bands;
	}

	public filterUpdated: Subject<FilterType> = new Subject<FilterType>();

	/**
	 *
	 */
	public constructor(private _storageSvc: StorageService) {
		this.configureSave();
		this.loadFilters();
	}

	public setAwardSchemes(schemes: AwardScheme[]): void {
		this._awardSchemes = schemes;
		this.filterUpdated.next(FilterType.Schemes);
	}

	public setSpotModes(modes: SpotMode[]): void {
		this._spotModes = modes;
		this.filterUpdated.next(FilterType.Modes);
	}

	public setBands(bands: Band[]): void {
		this._bands = bands;
		this.filterUpdated.next(FilterType.Bands);
	}

	private loadFilters(): void {
		const data = this._storageSvc.load<IStorageModel>("spotFilter");

		if (data == undefined) return;

		this._awardSchemes = data.awardSchemes;
		this._spotModes = data.spotModes;
		this._bands = data.bands;
	}

	private configureSave(): void {
		this.filterUpdated
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
	bands: Band[];
}
