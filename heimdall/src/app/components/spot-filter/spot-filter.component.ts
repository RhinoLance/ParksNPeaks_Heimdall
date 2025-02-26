import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbDropdown, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { SpotMode } from "src/app/models/SpotMode";
import { ModeBadgeComponent } from "../mode-badge/mode-badge.component";
import { FormsModule } from "@angular/forms";
import { AwardScheme } from "src/app/models/AwardScheme";
import { Band } from "src/app/models/Band";
import { SpotFilterService } from "src/app/services/SpotFilterService";
import { TmplAstUnknownBlock } from "@angular/compiler";

@Component({
	selector: "pph-spot-filter",
	imports: [CommonModule, FormsModule, NgbDropdownModule, ModeBadgeComponent],
	templateUrl: "./spot-filter.component.html",
	styleUrls: ["./spot-filter.component.scss"],
	standalone: true,
})
export class SpotFilterComponent implements AfterViewInit {
	@ViewChild("modeDrop") modeDrop: NgbDropdown;
	@ViewChild("bandDrop") bandDrop: NgbDropdown;
	@ViewChild("awardSchemeDrop") schemeDrop: NgbDropdown;

	public modeList: IModeFilterItem[] = [
		{ key: SpotMode.CW, checked: true },
		{ key: SpotMode.SSB, checked: true },
		{ key: SpotMode.FM, checked: true },
		{ key: SpotMode.AM, checked: true },
		{ key: SpotMode.DATA, checked: true },
		{ key: SpotMode.Other, checked: true },
	];

	public bandList: IBandFilterItem[] = [
		{ key: Band.M160, checked: true },
		{ key: Band.M80, checked: true },
		{ key: Band.M60, checked: true },
		{ key: Band.M40, checked: true },
		{ key: Band.M30, checked: true },
		{ key: Band.M20, checked: true },
		{ key: Band.M17, checked: true },
		{ key: Band.M15, checked: true },
		{ key: Band.M12, checked: true },
		{ key: Band.M10, checked: true },
		{ key: Band.M6, checked: true },
		{ key: Band.M4, checked: true },
		{ key: Band.M2, checked: true },
		{ key: Band.CM70, checked: true },
		{ key: Band.Microwave, checked: true },
	];

	public awardSchemeList: ISchemeFilterItem[] = [
		{ key: AwardScheme.BOTA, checked: true },
		{ key: AwardScheme.IOTA, checked: true },
		{ key: AwardScheme.POTA, checked: true },
		{ key: AwardScheme.SiOTA, checked: true },
		{ key: AwardScheme.SOTA, checked: true },
		{ key: AwardScheme.WWFF, checked: true },
		{ key: AwardScheme.ZLOTA, checked: true },
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
	public constructor(private _spotFilterSvc: SpotFilterService) {
		this.loadFilters();
	}

	public ngAfterViewInit() {
		this.configToggleDrops();
	}

	public loadFilters() {
		const filters = [
			{
				list: this.modeList,
				filter: this._spotFilterSvc.spotModes,
				filterState: this.filterState.mode,
			},
			{
				list: this.bandList,
				filter: this._spotFilterSvc.bands,
				filterState: this.filterState.band,
			},
			{
				list: this.awardSchemeList,
				filter: this._spotFilterSvc.awardSchemes,
				filterState: this.filterState.scheme,
			},
		];

		filters.map((v) => {
			if (v.filter.length > 0) {
				this.clearAllItems(v.list);

				v.filter.map((x) => {
					const item = v.list.find((y) => y.key == x);
					if (item) item.checked = true;
				});

				this.updateFilterState(v.list, v.filterState);
			}
		});
	}

	public selectionChanged(list: IChecked[]) {
		const hasUnchecked = this.hasUnChecked(list);
		const filterList = hasUnchecked
			? list.filter((x) => x.checked).map((x) => x.key)
			: [];

		let filterState: IFilterStateItem;

		switch (list) {
			case this.modeList:
				this._spotFilterSvc.setSpotModes(filterList as SpotMode[]);
				filterState = this.filterState.mode;
				break;
			case this.bandList:
				this._spotFilterSvc.setBands(filterList as Band[]);
				filterState = this.filterState.band;
				break;
			case this.awardSchemeList:
				this._spotFilterSvc.setAwardSchemes(filterList as AwardScheme[]);
				filterState = this.filterState.scheme;
				break;
		}

		this.updateFilterState(list, filterState);
	}

	public updateFilterState(list: IChecked[], state: IFilterStateItem) {
		state.active = this.hasUnChecked(list);
	}

	public updateModeFilter() {
		this.updateFilterState(this.modeList, this.filterState.mode);

		const list = this.hasUnChecked(this.modeList)
			? this.modeList.filter((x) => x.checked).map((x) => x.key)
			: [];

		this._spotFilterSvc.setSpotModes(list);
	}

	public updateBandFilter() {
		this.updateFilterState(this.bandList, this.filterState.band);

		const list = this.hasUnChecked(this.bandList)
			? this.bandList.filter((x) => x.checked).map((x) => x.key)
			: [];

		this._spotFilterSvc.setBands(list);
	}

	public updateSchemeFilter() {
		this.updateFilterState(this.awardSchemeList, this.filterState.scheme);

		const list = this.hasUnChecked(this.awardSchemeList)
			? this.awardSchemeList.filter((x) => x.checked).map((x) => x.key)
			: [];

		this._spotFilterSvc.setAwardSchemes(list);
	}

	private hasUnChecked(list: IChecked[]) {
		return list.some((x) => !x.checked);
	}

	private clearAllItems(list: IChecked[]) {
		list.forEach((x) => (x.checked = false));
	}

	private configToggleDrops() {
		this.modeDrop.openChange.subscribe((isOpen: boolean) => {
			if (!isOpen) return;
			[this.bandDrop, this.schemeDrop].map((x) => x.close());
		});

		this.bandDrop.openChange.subscribe((isOpen: boolean) => {
			if (!isOpen) return;
			[this.modeDrop, this.schemeDrop].map((x) => x.close());
		});

		this.schemeDrop.openChange.subscribe((isOpen: boolean) => {
			if (!isOpen) return;
			[this.modeDrop, this.bandDrop].map((x) => x.close());
		});
	}
}

interface IChecked {
	checked: boolean;
	key: unknown;
}
interface IModeFilterItem extends IChecked {
	key: SpotMode;
}
interface IBandFilterItem extends IChecked {
	key: Band;
}
interface ISchemeFilterItem extends IChecked {
	key: AwardScheme;
}

interface IFilterState {
	mode: IFilterStateItem;
	band: IFilterStateItem;
	scheme: IFilterStateItem;
}
interface IFilterStateItem {
	active: boolean;
}
