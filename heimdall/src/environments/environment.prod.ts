import { IEnvironment, EnvironmentName } from "./IEnvironment";

import { environment as masterEnvironment } from "./environment.localServer";

const overrides: Partial<IEnvironment> = {
	name: EnvironmentName.Prod,
	production: true,
	heimdallHubUrl: "https://rhinoswtools.azurewebsites.net/heimdallHub",
};

export const environment: IEnvironment = {
	...masterEnvironment,
	...overrides,
};
