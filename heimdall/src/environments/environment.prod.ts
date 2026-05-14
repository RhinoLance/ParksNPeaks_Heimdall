import { environmentBase } from "./environmentBase";
import { IEnvironment, EnvironmentName, DataSource } from "./IEnvironment";

const overrides: Partial<IEnvironment> = {
	name: EnvironmentName.Prod,
	production: true,
	heimdallHubUrl: "https://rhinoswtools.azurewebsites.net/heimdallHub",
	spotSources: environmentBase.spotSources,
};

overrides.spotSources.set(DataSource.ZLOTA, {
	baseHref: "https://ontheair.nz/",
	//baseHref: "https://rhinoswtools.azurewebsites.net/ZLotaProxy?suffix=",
	pollIntervalMinutes: 1,
	siteFilter: "^(?:AU|NZ|ZL)",
});

export const environment: IEnvironment = {
	...environmentBase,
	...overrides,
};
