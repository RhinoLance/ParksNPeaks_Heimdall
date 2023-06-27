import { Spot, SpotType } from "./Spot";

export class SpotCatalogue {
	
	private _spotCatalogue: Map<string, Spot[]>;

	constructor() {
		
		this._spotCatalogue = new Map<string, Spot[]>();

	}
	
	public addSpots( spotList: Spot[] ): void {
		
		spotList.map( spot => {
			const key = spot.callsignRoot + spot.siteId;

			if( !this._spotCatalogue.has(key) ){
				this._spotCatalogue.set(key, []);
			}

			this._spotCatalogue.get(key)!.push(spot);
		});

		this.setSpotOrder();
		this.setSpotTypes();
	}

	
	private setSpotOrder(): void {
		
		this._spotCatalogue.forEach( (spotList, key) => {
			this.orderSpotsByTimeDesc(spotList);
		});
	}

	private orderSpotsByTimeDesc( spotList: Spot[] ): void {
		spotList.sort( (a, b) => {
			return b.time.getTime() - a.time.getTime();
		});
	}

	private setSpotTypes(): void {

		var getSpotKey = (spot: Spot) => spot.frequency + spot.mode;

		this._spotCatalogue.forEach( (spotList, key) => {

			var lastKey = getSpotKey(spotList[0]);

			for( var cI=0; cI<spotList.length; cI++ ){
				if( cI == 0 ){
					spotList[cI].type = SpotType.New;
					spotList[cI].subSpotCount = spotList.length-1;					
				}
				else{
					var currentKey = getSpotKey(spotList[cI]);
					
					if( currentKey == lastKey ){
						spotList[cI].type = SpotType.Respot;
					}
					else{
						spotList[cI].type = SpotType.Spot;
						lastKey = currentKey;
					}
				}
			}
		
		});
	}

	public getCurrentSpots(): Spot[] {
	
		const outputList: Spot[] = [];
	
		this._spotCatalogue.forEach( (spotList, key) => {
			spotList.map( spot => {
				if( spot.type == SpotType.New ){
					outputList.push(spot);
				}
			});
		});
	
		this.orderSpotsByTimeDesc(outputList);

		return outputList;
	
	}

	public getSubSpots(spot: Spot): Spot[]{
		
		if( spot.subSpotCount == 0 ){
			return [];
		}

		const key = spot.callsignRoot + spot.siteId;
		const spotList = this._spotCatalogue.get(key);

		if( spotList == undefined ){
			return [];
		}

		const outputList: Spot[] = [];

		for( var cI=1; cI<spotList.length; cI++ ){
			outputList.push(spotList[cI]);
		}

		return outputList;

	}

	public getSpots(): Spot[]{
		
		const outputList: Spot[] = [];
	
		this._spotCatalogue.forEach( (spotList, key) => {
			spotList.map( spot => {
				outputList.push(spot);
			});
		});
	
		this.orderSpotsByTimeDesc(outputList);

		return outputList;
	}


	

}

