// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {
	DataSource,
	IEnvironment,
	EnvironmentName,
	ISpotSource,
} from "./IEnvironment";

export const environmentBase: IEnvironment = {
	name: EnvironmentName.Dev,
	production: false,
	heimdallHubUrl: "http://heimdall.conryclan.com/heimdallHub",

	spotSources: new Map<DataSource, ISpotSource>([
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
				baseHref: "https://api.pota.app/spot/activator/",
				pollIntervalMinutes: 1,
				siteFilter: "^(?:AU|NZ)",
			},
		],
		[
			DataSource.ZLOTA,
			{
				//baseHref: "https://ontheair.nz/",
				baseHref: "https://rhinoswtools.azurewebsites.net/ZLotaProxy?suffix=",
				pollIntervalMinutes: 1,
				siteFilter: "^(?:AU|NZ|ZL)",
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
 * The second pnpBaseHref with port 8080 is for testing with an external data file.  To use, 
  1. Copy the current dev data file to a temp location outside of the project root e.g. C:\Temp
  2. Run the following command to start a simple http server: 
	npx http-server C:\Temp -p 8080 --cors -c-1
  3. Edit and save the data file for spots to be received as required.

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
