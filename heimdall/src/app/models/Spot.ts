import { Guid } from "guid-typescript";
import { SpotType } from "./SpotType";
import { AwardScheme } from "./AwardScheme";
import { SpotMode } from "./SpotMode";

export class Spot {
	public id: Guid = Guid.create();
	public modeIcon: string = "";
	public modeColour: string = "";
	public modeName: string = "";
	public classImage: string = "";
	public type: SpotType = SpotType.NotSet;
	public subSpotCount: number = 0;
	public shortTime: string = "";
	public tPlusMinutes: number = 0;

	public altAward: AwardScheme = AwardScheme.Other;
	public callsign: string = "";
	public callsignRoot: string = "";
	public award: AwardScheme = AwardScheme.Other;
	public comment: string = "";
	public frequency: number = 0;
	public mode: SpotMode = SpotMode.Other;
	public siteId: string = "";
	public siteName: string = "";
	public spotter: string = "";
	public time: Date = new Date();

	private getModeIconAndColour(): [string, string, string] {
		let icon: string;
		let colour: string;
		const name: string = SpotMode[this.mode];

		switch (this.mode) {
			case SpotMode.AM:
				icon = "mdi-radio";
				colour = "#ff9f1c";
				break;
			case SpotMode.CW:
				icon = "mdi-dots-horizontal";
				colour = "#16425b";
				break;
			case SpotMode.DATA:
				icon = "mdi-memory";
				colour = "#fb8b24";
				break;
			case SpotMode.FM:
				icon = "mdi-radio-handheld";
				colour = "#2ec4b6";
				break;
			case SpotMode.SSB:
				icon = "mdi-waveform";
				colour = "#e71d36";
				break;
			default:
				icon = "radio";
				colour = "#f2e9e4";
				break;
		}

		return [name, icon, colour];
	}
}
