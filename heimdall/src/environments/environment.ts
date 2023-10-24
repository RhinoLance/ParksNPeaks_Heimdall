// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	potaBaseHref: "https://api.pota.app/",
	pnpBaseHref: "http://localhost:9000/?suffix=",
	zlotaBaseHref: "http://localhost:9000/zlota/?suffix=",
	//pnpBaseHref: "http://localhost:8080/pnp.spots.all.4.json/?suffix=",
	pnpPollMinutesInterval: 0.5,
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
