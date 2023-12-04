import { Environment, EnvironmentName } from "./TEnvironment";

export const environment: Environment = {
	name: EnvironmentName.Prod,
	production: true,
	potaBaseHref: "https://api.pota.app/",
	pnpBaseHref: "https://rhinoswtools.azurewebsites.net/PnPProxy?suffix=",
	zlotaBaseHref: "https://rhinoswtools.azurewebsites.net/ZLotaProxy?suffix=",
	heimdallHubUrl: "https://rhinoswtools.azurewebsites.net/heimdallHub",
	pnpPollMinutesInterval: 1,
};
