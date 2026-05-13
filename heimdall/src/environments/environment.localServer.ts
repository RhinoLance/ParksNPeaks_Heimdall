import { IEnvironment, EnvironmentName } from "./IEnvironment";

import { environment as masterEnvironment } from "./environment.localServer";

const overrides: Partial<IEnvironment> = {
	name: EnvironmentName.Empty,
	production: false,
	heimdallHubUrl: "https://localhost:44321/heimdallHub",
};

export const environment: IEnvironment = {
	...masterEnvironment,
	...overrides,
};
