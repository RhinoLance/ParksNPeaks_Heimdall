// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {
	DataSource,
	Environment,
	EnvironmentName,
	SpotSource,
} from "./TEnvironment";

export const environment: Environment = {
	name: EnvironmentName.Empty,
	production: false,
	potaBaseHref: "https://api.pota.app/",
	pnpBaseHref: "http://localhost:9000/?suffix=",
	zlotaBaseHref: "http://localhost:9000/zlota/?suffix=",
	heimdallHubUrl: "http://heimdall.conryclan.com/heimdallHub",
	wwffBaseHref: "https://spots.wwff.co/static/spots.json",
	//pnpBaseHref: 'https://rhinoswtools.azurewebsites.net/api/PnP/Get?suffix=',
	pnpPollMinutesInterval: 1,

	spotSources: new Map<DataSource, SpotSource>([
		[
			DataSource.WWFF,
			{
				baseHref: "https://spots.wwff.co/static/spots.json",
				pollIntervalMinutes: 1,
				siteFilter: "^(?:VKFF|ZLFF)",
			},
		],
		[
			DataSource.SOTA,
			{
				baseHref: "https://api-db2.sota.org.uk/api/",
				pollIntervalMinutes: 1,
				siteFilter: "^(?:VK|ZL)",
			},
		],
		[
			DataSource.POTA,
			{
				baseHref: "https://api.pota.app/spot/activator",
				pollIntervalMinutes: 1,
				siteFilter: "^(?:AU|NZ)",
			},
		],
		[
			DataSource.ZLOTA,
			{
				baseHref: "https://ontheair.nz/api/spots",
				pollIntervalMinutes: 1,
				siteFilter: "^(?:AU|NZ)",
			},
		],
		[
			DataSource.PNP,
			{
				baseHref: "https://rhinoswtools.azurewebsites.net/PnPProxy?suffix=",
				pollIntervalMinutes: 1,
				siteFilter: "^(?:VK|VL|VJ|VI|ZL|ZZ)",
			},
		],
	]),
	maxSpotAgeMinutes: 120,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
