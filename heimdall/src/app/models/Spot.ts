import { Guid } from "guid-typescript";
import { SpotType } from "./SpotType";
import { SpotMode } from "./SpotMode";
import { AwardScheme } from "./AwardScheme";
import { ActivationAwardList } from "./ActivationAwardList";

export class Spot {
	public id: Guid = Guid.create();
	public type: SpotType = SpotType.NotSet;
	public tPlusMinutes: number = 0;

	public callsign: string = "";
	public callsignRoot: string = "";
	public comment: string = "";
	public frequency: number = 0;
	public mode: SpotMode = SpotMode.Other;
	public siteName: string = "";
	public spotter: string = "";
	public time: Date = new Date();

	public awardList: ActivationAwardList = new ActivationAwardList();

	private _shortTime: string = "";

	public get primaryAward(): AwardScheme {
		return this.awardList.getAtIndex(0).award;
	}

	public get primarySiteId(): string {
		return this.awardList.getAtIndex(0).siteId;
	}

	public get shortTime(): string {
		if (this._shortTime == "") {
			this._shortTime =
				this.time.getHours().toString().padStart(2, "0") +
				":" +
				this.time.getMinutes().toString().padStart(2, "0");
		}

		return this._shortTime;
	}

	public clone() {
		const retVal = new Spot();
		retVal.id = Guid.create();
		retVal.type = this.type;
		retVal.tPlusMinutes = this.tPlusMinutes;
		retVal.callsign = this.callsign.slice();
		retVal.callsignRoot = this.callsignRoot.slice();
		retVal.comment = this.comment.slice();
		retVal.frequency = this.frequency;
		retVal.mode = this.mode;
		retVal.siteName = this.siteName;
		retVal.spotter = this.spotter;
		retVal.time = this.time;
		retVal.awardList = this.awardList.clone();
		retVal._shortTime = this._shortTime;
		return retVal;
	}
}
