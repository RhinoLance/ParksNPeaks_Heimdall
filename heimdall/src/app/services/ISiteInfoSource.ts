import { Observable } from "rxjs";

export interface ISiteInfoSource {
	getSiteInfo(siteId: string): Observable<ISiteInfo>;
}

export interface ISiteInfo {
	siteId: string;
	siteName: string;
	lat: number;
	lon: number;
}
