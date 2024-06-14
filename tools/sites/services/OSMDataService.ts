import { environment } from "environment";

export class OSMDataService{

	private _requestQueue: (() => void)[] = [];

	public async retrieveFeatureByName(name: string): Promise<OSMSite>{

		const url = `${environment.osmReverseLookupApiUrl}?q=${name}&format=json&polygon_geojson=1&limit=1`;
		const response = await fetch( url, {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"User-Agent": "l a n c e @ c o n r y c l a n . c o m"
			}
		} );

		const json = await response.json();
		
		return json[0];

	}
}

export type OSMSite = {
	place_id: number;
	licence: string;
	osm_type: string;
	osm_id: number;
	lat: string;
	lon: string;
	class: string;
	type: string;
	place_rank: number;
	importance: number;
	addresstype: string;
	name: string;
	display_name: string;
	boundingbox: string[];
	geojson: {
		type: string;
		coordinates: number[];
	};
};