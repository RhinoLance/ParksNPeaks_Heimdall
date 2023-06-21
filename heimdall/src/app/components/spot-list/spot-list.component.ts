import { Component, OnInit } from '@angular/core';
import { Spot } from 'src/app/models/Spot';
import { PNPClient } from 'src/app/services/PNPClient';

@Component({
  selector: 'app-spot-list',
  templateUrl: './spot-list.component.html',
  styleUrls: ['./spot-list.component.scss']
})
export class SpotListComponent implements OnInit {

  _spotList: Spot[] = [];

  constructor( _pnpClient: PNPClient) { 

    _pnpClient.getSpotList().then((spots) => {
      this._spotList.length = 0;
      this._spotList = spots;
    });

  }

  ngOnInit(): void {
  }

}
