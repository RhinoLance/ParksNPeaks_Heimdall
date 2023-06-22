import { Component, Input, OnInit } from '@angular/core';
import { Spot } from 'src/app/models/Spot';

@Component({
	selector: 'spot-history-card',
	templateUrl: './spot-history-card.component.html',
	styleUrls: ['./spot-history-card.component.scss'],
})

export class SpotHistoryCardComponent implements OnInit {
	
	@Input() spotList: Spot[] = [];

	constructor() {
		
	}

	ngOnInit(): void {}
}



