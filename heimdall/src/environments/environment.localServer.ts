// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {
	IEnvironment,
	EnvironmentName,
	DataSource,
	ISpotSourceArgs,
} from "./IEnvironment";

import { environmentBase } from "./environmentBase";

const overrides: Partial<IEnvironment> = {
	name: EnvironmentName.LocalServer,
	production: false,
	spotSources: new Map<DataSource, ISpotSourceArgs>([
		[
			DataSource.POTA,
			{
				baseHref: "http://localhost:9000/pota/",
				pollIntervalMinutes: 1,
				siteFilter: "^.*",
			},
		],
	]),
	maxSpotAgeMinutes: 99999999999,
};

export const environment: IEnvironment = {
	...environmentBase,
	...overrides,
};
