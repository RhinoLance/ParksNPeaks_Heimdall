import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { SpotMode } from "src/app/models/SpotMode";
import { ModeBadgeComponent } from "../mode-badge/mode-badge.component";
import { FormsModule } from "@angular/forms";
import { AwardScheme } from "src/app/models/AwardScheme";
import { Bands, IFrequencyBand } from "src/app/models/Bands";
import { SpotFilterService } from "src/app/services/SpotFilterService";

@Component({
	selector: "pph-spot-filter",
	imports: [CommonModule, FormsModule, NgbDropdownModule, ModeBadgeComponent],
	templateUrl: "./spot-filter.component.html",
	styleUrls: ["./spot-filter.component.scss"],
	standalone: true,
})
export class SpotFilterComponent {
	public modeList: IModeFilterItem[] = [
		{ mode: SpotMode.CW, checked: true },
		{ mode: SpotMode.SSB, checked: true },
		{ mode: SpotMode.FM, checked: true },
		{ mode: SpotMode.AM, checked: true },
		{ mode: SpotMode.DATA, checked: true },
		{ mode: SpotMode.Other, checked: true },
	];

	public bandList: IBandFilterItem[] = [
		{ band: Bands.m160, checked: true },
		{ band: Bands.m80, checked: true },
		{ band: Bands.m60, checked: true },
		{ band: Bands.m40, checked: true },
		{ band: Bands.m30, checked: true },
		{ band: Bands.m20, checked: true },
		{ band: Bands.m17, checked: true },
		{ band: Bands.m15, checked: true },
		{ band: Bands.m12, checked: true },
		{ band: Bands.m10, checked: true },
		{ band: Bands.m6, checked: true },
		{ band: Bands.m4, checked: true },
		{ band: Bands.m2, checked: true },
		{ band: Bands.cm70, checked: true },
		{ band: Bands.Microwave, checked: true },
	];

	public schemeList: ISchemeFilterItem[] = [
		{ name: "BOTA", scheme: AwardScheme.BOTA, checked: true },
		{ name: "IOTA", scheme: AwardScheme.IOTA, checked: true },
		{ name: "POTA", scheme: AwardScheme.POTA, checked: true },
		{ name: "SiOTA", scheme: AwardScheme.SiOTA, checked: true },
		{ name: "SOTA", scheme: AwardScheme.SOTA, checked: true },
		{ name: "WWFF", scheme: AwardScheme.WWFF, checked: true },
		{ name: "ZLOTA", scheme: AwardScheme.ZLOTA, checked: true },
		{ name: "Other", scheme: undefined, checked: true },
	];

	public filterState: IFilterState = {
		mode: {
			active: false,
		},
		band: {
			active: false,
		},
		scheme: {
			active: false,
		},
	};

	/**
	 *
	 */
	constructor(private _spotFilterSvc: SpotFilterService) {
		this.loadFilters();
	}

	public loadFilters() {
		// Load Mode Filters
		if (this._spotFilterSvc.spotModes.length > 0) {
			this.clearAllItems(this.modeList);

			this._spotFilterSvc.spotModes.map((x) => {
				const item = this.modeList.find((y) => y.mode == x);
				if (item) item.checked = true;
			});

			this.updateFilterState(this.modeList, this.filterState.mode);
		}

		// Load Band Filters
		if (this._spotFilterSvc.bands.length > 0) {
			this.clearAllItems(this.bandList);

			this._spotFilterSvc.bands.map((x) => {
				const item = this.bandList.find((y) => y.band.name == x.name);
				if (item) item.checked = true;
			});

			this.updateFilterState(this.bandList, this.filterState.band);
		}

		// Load Scheme Filters
		if (this._spotFilterSvc.awardSchemes.length > 0) {
			this.clearAllItems(this.schemeList);

			this._spotFilterSvc.awardSchemes.map((x) => {
				const item = this.schemeList.find((y) => y.scheme == x);
				if (item) item.checked = true;
			});

			this.updateFilterState(this.schemeList, this.filterState.scheme);
		}
	}

	public updateFilterState(list: IChecked[], state: IFilterStateItem) {
		state.active = this.hasUnChecked(list);
	}

	public updateModeFilter(isOpen: boolean) {
		if (isOpen) return;

		this.updateFilterState(this.modeList, this.filterState.mode);

		const list = this.hasUnChecked(this.modeList)
			? this.modeList.filter((x) => x.checked).map((x) => x.mode)
			: [];

		this._spotFilterSvc.setSpotModes(list);
	}

	public updateBandFilter(isOpen: boolean) {
		if (isOpen) return;

		this.updateFilterState(this.bandList, this.filterState.band);

		const list = this.hasUnChecked(this.bandList)
			? this.bandList.filter((x) => x.checked).map((x) => x.band)
			: [];

		this._spotFilterSvc.setBands(list);
	}

	public updateSchemeFilter(isOpen: boolean) {
		if (isOpen) return;

		this.updateFilterState(this.schemeList, this.filterState.scheme);

		const list = this.hasUnChecked(this.schemeList)
			? this.schemeList.filter((x) => x.checked).map((x) => x.scheme)
			: [];

		this._spotFilterSvc.setAwardSchemes(list);
	}

	private hasUnChecked(list: IChecked[]) {
		return list.some((x) => !x.checked);
	}

	private clearAllItems(list: IChecked[]) {
		list.forEach((x) => (x.checked = false));
	}
}

interface IChecked {
	checked: boolean;
}
interface IModeFilterItem extends IChecked {
	mode: SpotMode;
}
interface IBandFilterItem extends IChecked {
	band: IFrequencyBand;
}
interface ISchemeFilterItem extends IChecked {
	name: string;
	scheme: AwardScheme;
}

interface IFilterState {
	mode: IFilterStateItem;
	band: IFilterStateItem;
	scheme: IFilterStateItem;
}
interface IFilterStateItem {
	active: boolean;
}
