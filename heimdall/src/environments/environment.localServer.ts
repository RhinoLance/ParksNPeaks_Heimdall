import { Environment, EnvironmentName } from "./TEnvironment";

export const environment: Environment = {
	name: EnvironmentName.LocalServer,
	production: true,
	potaBaseHref: "https://api.pota.app/",
	pnpBaseHref: "https://localhost:44321/PnPProxy?suffix=",
	siotaBaseHref: "https://localhost:44321/SiOtaProxy?suffix=",
	zlotaBaseHref: "https://localhost:44321/ZLotaProxy?suffix=",
	heimdallHubUrl: "https://localhost:44321/heimdallHub",
	pnpPollMinutesInterval: 1,
};
