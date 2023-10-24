import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { FetchService, TInit } from "./FetchService";
import { lastValueFrom } from "rxjs";
import { ZLotaSite } from "../models/ZLotaSite";

@Injectable({
	providedIn: "root",
})
export class ZLotaClientService {
	private _baseHref: string = environment.zlotaBaseHref;

	public constructor(private _fetchSvc: FetchService) {}

	public async getSite(siteId: string): Promise<ZLotaSite> {
		siteId = siteId.replace("/", "_");

		const data = await this.get(`assets/${siteId}`);

		const site: ZLotaSite = {
			longitude: this.extractCoords(data)[0],
			latitude: this.extractCoords(data)[1],
		};

		return site;
	}

	private extractCoords(data: string): number[] {
		const regEx = /place_init\('POINT \((-?\d+\.\d+) (-?\d+\.\d+)\)/;

		const coords = data.match(regEx);

		if (coords === null) {
			throw new Error("Could not extract coords");
		}

		//extract the coords from the match
		const longitude = parseFloat(coords[1]);
		const latitude = parseFloat(coords[2]);
		const coord = [longitude, latitude];

		return coord;
	}

	private async get(suffix: string): Promise<string> {
		const request: TInit = {
			method: "GET",
			headers: {
				"Content-Type": "text/html; charset=utf-8",
			},
			selector: (response: Response) => response.text(),
		};

		const data = await lastValueFrom<string>(
			this._fetchSvc.fetch<string>(this._baseHref + suffix, request)
		);

		return data;
	}
}

export type PostResponse = {
	response: string;
};

/*
const document = window.document;
document.getElementById("page_status")!.innerHTML = ''; 
document.body.classList.remove('loading'); 
document.title = 'ZL On the Air'
document.getElementById('logo').innerHTML = 'ZL On The Air'
place_init('POINT (174.76688571271504 -37.37856198809858)',  0, site_purple_star);      
place_init('MULTIPOLYGON(((174.773008399745 -37.3798956332944,174.771563466546 -37.3811194335877,174.766702233816 -37.3786945668604,174.773717783138 -37.3727238996437,174.777826733107 -37.3758126329713,174.773008399745 -37.3798956332944)),((174.760348216281 -37.3863221003534,174.760257967059 -37.386550067018,174.758366066441 -37.3862018668683,174.757436833696 -37.3860249499278,174.761039516845 -37.3770163331978,174.761886450517 -37.3766737665355,174.763885382776 -37.377564299915,174.760348216281 -37.3863221003534)),((174.764927100546 -37.3874305832467,174.764925632975 -37.3874341336305,174.764458900116 -37.387345767,174.762506200069 -37.386860466361,174.762662250029 -37.386468516732,174.766025816313 -37.3785752834452,174.768149333027 -37.3796561667036,174.764927100546 -37.3874305832467)),((174.769149016935 -37.3692873332081,174.761684949712 -37.3756721504412,174.761563983099 -37.3753876167026,174.761504249845 -37.3748029002454,174.761115066766 -37.3741702668689,174.760891783554 -37.3740507499096,174.760955033807 -37.3739225166139,174.760915833538 -37.3738667997323,174.767609183155 -37.3681286167812,174.769149016935 -37.3692873332081)))',  1,site_highlight_polygon);    
*/
