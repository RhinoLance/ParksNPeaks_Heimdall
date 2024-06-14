export const environment: Environment = {
	production: true,
	wwffDirectoryUrl: "https://wwff.co/directory",
	osmReverseLookupApiUrl: "https://nominatim.openstreetmap.org/search",
	wwffSitesPath: "data/sitesWWFF.json",
	osmSitesPath: "data/sitesOSM.geojson",

};

export type Environment = {
	production: boolean,
	wwffSitesPath: string,
	osmSitesPath: string,
	wwffDirectoryUrl: string,
	osmReverseLookupApiUrl: string
}