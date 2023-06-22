import { Component, OnInit } from '@angular/core';
import { Spot } from 'src/app/models/Spot';
import { SpotCatalogue } from 'src/app/models/SpotCatalogue';
import { PNPClient } from 'src/app/services/PNPClient';

@Component({
	selector: 'app-spot-list',
	templateUrl: './spot-list.component.html',
	styleUrls: ['./spot-list.component.scss'],
})
export class SpotListComponent implements OnInit {
	_spotList: Spot[] = [];

	_spotCalatogue: SpotCatalogue = new SpotCatalogue([]);
	
	constructor(_pnpClient: PNPClient) {
		_pnpClient.getSpotList().then((spots) => {
			
			this._spotCalatogue = new SpotCatalogue(spots);
			this._spotList = this._spotCalatogue.GetCurrentSpots();
		});
	}

	ngOnInit(): void {}

	public getSubSpots(spot: Spot): Spot[]{
		return this._spotCalatogue.getSubSpots(spot);
	}
}


