// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { IEnvironment, EnvironmentName } from "./IEnvironment";

import { environmentBase } from "./environmentBase";

const overrides: Partial<IEnvironment> = {
	name: EnvironmentName.LocalServer,
	production: false,
};

export const environment: IEnvironment = {
	...environmentBase,
	...overrides,
};
