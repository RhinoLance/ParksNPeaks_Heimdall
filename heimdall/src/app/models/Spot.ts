import { SpotType } from "./SpotType";
import { SpotMode } from "./SpotMode";
import { AwardScheme } from "./AwardScheme";
import { ActivationAwardList } from "./ActivationAwardList";
import { Guid } from "./Guid";

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
		this.copyTo(retVal);

		return retVal;
	}

	public copyTo(target: Spot) {
		target.type = this.type;
		target.tPlusMinutes = this.tPlusMinutes;
		target.callsign = this.callsign;
		target.callsignRoot = this.callsignRoot;
		target.comment = this.comment;
		target.frequency = this.frequency;
		target.mode = this.mode;
		target.siteName = this.siteName;
		target.spotter = this.spotter;
		target.time = this.time;
		target.awardList = this.awardList.clone();
		target._shortTime = this._shortTime;
	}
}
