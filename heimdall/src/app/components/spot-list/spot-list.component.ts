import { Component, OnInit } from '@angular/core';
import { Spot, SpotClass, SpotMode } from 'src/app/models/Spot';
import { PNPClient } from 'src/app/services/PNPClient';

@Component({
	selector: 'app-spot-list',
	templateUrl: './spot-list.component.html',
	styleUrls: ['./spot-list.component.scss'],
})
export class SpotListComponent implements OnInit {
	_spotList: DisplaySpot[] = [];

	constructor(_pnpClient: PNPClient) {
		_pnpClient.getSpotList().then((spots) => {
			this._spotList.length = 0;
			this._spotList = spots.map((spot) => new DisplaySpot(spot));
		});
	}

	ngOnInit(): void {}
}

class DisplaySpot extends Spot {
	public modeIcon: string = '';
	public modeColour: string = '';
	public modeName: string = '';
	public classImage: string = '';

	constructor(spot: Spot) {
		super();

		this.altClass = spot.altClass;
		this.altLocation = spot.altLocation;
		this.callsign = spot.callsign;
		this.class = spot.class;
		this.comment = spot.comment;
		this.frequency = spot.frequency;
		this.location = spot.location;
		this.mode = spot.mode;
		this.siteId = spot.siteId;
		this.spotter = spot.spotter;
		this.time = spot.time;

		[this.modeName, this.modeIcon, this.modeColour] =
			this.getModeIconAndColour();
		this.classImage = this.getClassImage();
	}

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

	private getClassImage(): string {
		var image: string = '';

		switch (this.class) {
			case SpotClass.BOTA:
				image = 'assets/images/classLogo/BOTA.png';
				break;
			case SpotClass.POTA:
				image = 'assets/images/classLogo/POTA.jpg';
				break;
			case SpotClass.VK_SOTA:
			case SpotClass.ZL_SOTA:
			case SpotClass.SOTA:
				image = 'assets/images/classLogo/SOTA.svg';
				break;
			case SpotClass.VK_WWFF:
			case SpotClass.VK_WWFF:
			case SpotClass.WWFF:
				image = 'assets/images/classLogo/WWFF.png';
				break;
			default:
				image = 'assets/images/classLogo/other.png';
				break;
		}

		return image;
	}
}
