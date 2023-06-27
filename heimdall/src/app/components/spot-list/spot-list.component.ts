import { Component, OnInit } from '@angular/core';
import { Spot } from 'src/app/models/Spot';
import { SpotCatalogue } from 'src/app/models/SpotCatalogue';
import { TimeUpdator } from 'src/app/models/TimeUpdator';
import { PNPClient } from 'src/app/services/PNPClient';

@Component({
	selector: 'app-spot-list',
	templateUrl: './spot-list.component.html',
	styleUrls: ['./spot-list.component.scss'],
})
export class SpotListComponent implements OnInit {
	_spotList: Spot[] = [];

	_spotCalatogue: SpotCatalogue = new SpotCatalogue();
	_spotTimeUpdator: TimeUpdator = new TimeUpdator(this._spotCalatogue);
	
	constructor(_pnpClient: PNPClient) {
		_pnpClient.getSpotList().then((spots) => {
			
			this._spotCalatogue.addSpots(spots);
			this._spotList = this._spotCalatogue.getCurrentSpots();

			this._spotTimeUpdator.start();
		});
	}

	ngOnInit(): void {}

	ngOnDestroy(): void {
		this._spotTimeUpdator.stop();
	}

	public getSubSpots(spot: Spot): Spot[]{
		return this._spotCalatogue.getSubSpots(spot);
	}
}


