// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment, EnvironmentName } from "./TEnvironment";

export const environment: Environment = {
	name: EnvironmentName.Empty,
	production: false,
	potaBaseHref: "https://api.pota.app/",
	pnpBaseHref: "http://localhost:9000/?suffix=",
	siotaBaseHref: "http://localhost:9000/siota?suffix=",
	zlotaBaseHref: "http://localhost:9000/zlota/?suffix=",
	heimdallHubUrl: "http://heimdall.conryclan.com/heimdallHub",
	//pnpBaseHref: 'https://rhinoswtools.azurewebsites.net/api/PnP/Get?suffix=',
	pnpPollMinutesInterval: 1,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
