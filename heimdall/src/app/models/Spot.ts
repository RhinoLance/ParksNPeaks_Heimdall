import { PnPSpot } from "./PnPSpot";

export class Spot {
	
	public modeIcon: string = '';
	public modeColour: string = '';
	public modeName: string = '';
	public classImage: string = '';
	public type: SpotType = SpotType.NotSet;
	public subSpotCount: number = 0;
	public shortTime: string = '';

	public altClass: SpotClass = SpotClass.Other;
	public altLocation: string = '';
	public callsign: string = '';
	public callsignRoot: string = '';
	public class: SpotClass = SpotClass.Other;
	public comment: string = '';
	public frequency: number = 0;
	public location: string = '';
	public mode: SpotMode = SpotMode.Other;
	public siteId: string = '';
	public spotter: string = '';
	public time: Date = new Date();

	private getModeIconAndColour(): [string, string, string] {
		var icon: string;
		var colour: string;
		var name: string = SpotMode[this.mode];

		switch (this.mode) {
			case SpotMode.AM:
				icon = 'mdi-radio';
				colour = '#ff9f1c';
				break;
			case SpotMode.CW:
				icon = 'mdi-dots-horizontal';
				colour = '#16425b';
				break;
			case SpotMode.DATA:
				icon = 'mdi-memory';
				colour = '#fb8b24';
				break;
			case SpotMode.FM:
				icon = 'mdi-radio-handheld';
				colour = '#2ec4b6';
				break;
			case SpotMode.SSB:
				icon = 'mdi-waveform';
				colour = '#e71d36';
				break;
			default:
				icon = 'radio';
				colour = '#f2e9e4';
				break;
		}

		return [name, icon, colour];
	}
}

export enum SpotMode {
	SSB,
	CW,
	FM,
	AM,
	DATA,
	Other,
}

export enum SpotClass {
	BOTA,
	DXCluster,
	HEMA,
	ILLW,
	IOTA,
	JOTA,
	KRNMPA,
	Other,
	POTA,
	QRP,
	SANPCPA,
	SiOTA,
	SOTA,
	WWFF,
	VK_Shires,
	VK_SOTA,
	VK_WWFF,
	ZL_OTA,
	ZL_SOTA,
	ZL_WWFF,
	ZLOTA
}

export enum SpotType {
	Respot,
	Spot,
	New,
	NotSet
}
