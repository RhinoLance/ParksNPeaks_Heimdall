import { Environment, EnvironmentName, SpotSource } from "./TEnvironment";

export const environment: Environment = {
	name: EnvironmentName.LocalServer,
	production: true,
	potaBaseHref: "https://api.pota.app/",
	pnpBaseHref: "https://localhost:44321/PnPProxy?suffix=",
	zlotaBaseHref: "https://localhost:44321/ZLotaProxy?suffix=",
	wwffBaseHref: "https://spots.wwff.co/static/spots.json",
	heimdallHubUrl: "https://localhost:44321/heimdallHub",
	pnpPollMinutesInterval: 1,

	spotSources: new Map<string, SpotSource>([
		[
			"wwff",
			{
				baseHref: "https://spots.wwff.co/static/spots.json",
				pollIntervalMinutes: 1,
				//siteFilter: "^(?:VKFF|ZLFF)",
				siteFilter: "",
			},
		],
		[
			"pnp",
			{
				baseHref: "https://rhinoswtools.azurewebsites.net/PnPProxy?suffix=",
				pollIntervalMinutes: 1,
				siteFilter: "^(?:VK|VL|VJ|VI|ZL|ZZ)",
			},
		],
	]),
	maxSpotAgeMinutes: 120,
};
