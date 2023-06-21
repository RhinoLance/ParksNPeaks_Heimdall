import { Component, OnInit } from '@angular/core';
import { Spot, SpotMode } from 'src/app/models/Spot';
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

class DisplaySpot extends Spot {

  public modeIcon: string = "";
  public modeColour: string = "";
  
  constructor( spot: Spot) {

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

    [this.modeIcon, this.modeColour] = this.getModeIconAndColour();

  }

  private getModeIconAndColour(): [string,string] {
    
    var icon: string;
    var colour: string;

    switch (this.mode) {
      case SpotMode.AM:
        icon = "mdi-radio";
        colour = "#335c67";
        break;
      case SpotMode.CW:
        icon = "mdi-dots-horizontal";
        colour = "#9a031e";
        break;
      case SpotMode.DATA:
        icon = "mdi-memory";
        colour = "#fb8b24";
        break;
      case SpotMode.FM:
        icon = "mdi-radio-handheld";
        colour = "#e36414";
        break;
      case SpotMode.SSB:
        icon = "mdi-waveform";
        colour = "#e36414";
        break;
      default:
        icon = "radio";
        colour = "#f2e9e4";
        break;
    }

    return [icon, colour];

  }



}
