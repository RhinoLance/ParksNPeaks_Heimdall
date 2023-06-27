import { Component, OnDestroy, OnInit } from '@angular/core';
import { Spot } from 'src/app/models/Spot';
import { SpotCatalogue } from 'src/app/models/SpotCatalogue';
import { TimeUpdator } from 'src/app/models/TimeUpdator';
import { PNPClient } from 'src/app/services/PNPClient';

@Component({
	selector: 'pph-spot-list',
	templateUrl: './spot-list.component.html',
	styleUrls: ['./spot-list.component.scss'],
})
export class SpotListComponent implements OnDestroy {
	
	public viewState: ViewState = {
		spotList: []
	}

	

	private _spotCalatogue: SpotCatalogue = new SpotCatalogue();
	private _spotTimeUpdator: TimeUpdator = new TimeUpdator(this._spotCalatogue);
	
	public constructor(_pnpClient: PNPClient) {
		_pnpClient.getSpotList().then((spots) => {
			
			this._spotCalatogue.addSpots(spots);
			this.viewState.spotList = this._spotCalatogue.getCurrentSpots();

			this._spotTimeUpdator.start();
		});
	}

	public ngOnDestroy(): void {
		this._spotTimeUpdator.stop();
	}

	public getSubSpots(spot: Spot): Spot[]{
		return this._spotCalatogue.getSubSpots(spot);
	}
}

interface ViewState {
	spotList: Spot[];
}
