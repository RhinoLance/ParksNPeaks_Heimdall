import { Component, Input, OnInit } from '@angular/core';
import { Spot } from 'src/app/models/Spot';

@Component({
	selector: 'spot-history-card',
	templateUrl: './spot-history-card.component.html',
	styleUrls: ['./spot-history-card.component.scss'],
})

export class SpotHistoryCardComponent implements OnInit {
	
	@Input() spotList: Spot[] = [];
	@Input() expanded: boolean = false;

	public viewState = {
		bodyDisplay: "collapsed"
	}

	constructor() {
		
	}

	ngOnInit(): void {

		this.viewState.bodyDisplay = "collapsed";
	}

	public toggleBodyDisplay(): void {
		
		switch( this.viewState.bodyDisplay ){
			case "collapsed":
				this.viewState.bodyDisplay = "inline";

				break;
			case "inline":
				this.viewState.bodyDisplay = "expanded";
				break;

			default:
				this.viewState.bodyDisplay = "collapsed";
		}
	}
}



