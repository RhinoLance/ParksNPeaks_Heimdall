import { PnPSpot } from "./PnPSpot";
import { Spot } from "./Spot";
import { SpotBuilder } from "./SpotBuilder";

type SortOrder = "ASC" | "DESC";

export class SpotListBuilder {
	private _callsignFilter: string = "";
	private _sortOrder: SortOrder = "DESC";

	public setCallsignFilter(region: string): SpotListBuilder {
		this._callsignFilter = region;
		return this;
	}

	public setSorting(order: SortOrder): SpotListBuilder {
		this._sortOrder = order;
		return this;
	}

	private filterCallsign(
		pnpSpotList: PnPSpot[],
		callsignFilter: string
	): PnPSpot[] {
		return pnpSpotList.filter((v) => v.actCallsign.match(callsignFilter));
	}

	private sortSpots(pnpSpotList: PnPSpot[], sortOrder: SortOrder): PnPSpot[] {
		return pnpSpotList.sort((a, b) => {
			if (sortOrder === "DESC") {
				const temp = a;
				a = b;
				b = temp;
			}

			return new Date(a.actTime).getTime() - new Date(b.actTime).getTime();
		});
	}

	private transformPnPSpotsToSpots(pnpSpots: PnPSpot[]): Spot[] {
		return pnpSpots.map((pnpSpot: PnPSpot) =>
			new SpotBuilder().addPnpSpot(pnpSpot).build()
		);
	}

	public buildFromPnPSpots(pnpSpots: PnPSpot[]): Spot[] {
		let data = pnpSpots;

		if (this._callsignFilter) {
			data = this.filterCallsign(data, this._callsignFilter);
		}

		if (this._sortOrder) {
			data = this.sortSpots(data, this._sortOrder);
		}

		const output: Spot[] = this.transformPnPSpotsToSpots(data);

		return output;
	}
}
