import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { SpotMode } from "src/app/models/SpotMode";
import { ModeBadgeComponent } from "../mode-badge/mode-badge.component";
import { FormsModule } from "@angular/forms";
import { AwardScheme } from "src/app/models/AwardScheme";

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
		{ name: "160m", kHz: 1800, checked: true },
		{ name: "80m", kHz: 3500, checked: true },
		{ name: "40m", kHz: 7000, checked: true },
		{ name: "30m", kHz: 10100, checked: true },
		{ name: "20m", kHz: 14000, checked: true },
		{ name: "17m", kHz: 18068, checked: true },
		{ name: "15m", kHz: 21000, checked: true },
		{ name: "12m", kHz: 24890, checked: true },
		{ name: "10m", kHz: 28000, checked: true },
		{ name: "6m", kHz: 50000, checked: true },
		{ name: "2m", kHz: 144000, checked: true },
		{ name: "70cm", kHz: 432000, checked: true },
		{ name: "23cm", kHz: 1296000, checked: true },
		{ name: "13cm", kHz: 2300000, checked: true },
		{ name: "9cm", kHz: 3456000, checked: true },
		{ name: "6cm", kHz: 5760000, checked: true },
		{ name: "3cm", kHz: 10368000, checked: true },
		{ name: "Microwave", kHz: 24192000, checked: true },
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

	public filterState = {
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

	public updateFilterState(list: IChecked[]) {
		this.filterState.mode.active = this.hasUnChecked(list);
	}

	public updateModeFilter(isOpen: boolean) {
		if (isOpen) return;

		this.updateFilterState(this.modeList);
	}

	public updateBandFilter(isOpen: boolean) {
		if (isOpen) return;

		this.updateFilterState(this.bandList);
	}

	public updateSchemeFilter(isOpen: boolean) {
		if (isOpen) return;

		this.updateFilterState(this.schemeList);
	}

	public hasUnChecked(list: IChecked[]) {
		return list.some((x) => !x.checked);
	}
}

interface IChecked {
	checked: boolean;
}
interface IModeFilterItem extends IChecked {
	mode: SpotMode;
}
interface IBandFilterItem extends IChecked {
	name: string;
	kHz: number;
}
interface ISchemeFilterItem extends IChecked {
	name: string;
	scheme: AwardScheme;
}
