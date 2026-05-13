import {
	DataSource,
	Environment,
	EnvironmentName,
	SpotSource,
} from "./TEnvironment";

export const environment: Environment = {
	name: EnvironmentName.LocalServer,
	production: true,
	potaBaseHref: "https://api.pota.app/",
	pnpBaseHref: "https://localhost:44321/PnPProxy?suffix=",
	zlotaBaseHref: "https://localhost:44321/ZLotaProxy?suffix=",
	wwffBaseHref: "https://spots.wwff.co/static/spots.json",
	heimdallHubUrl: "https://localhost:44321/heimdallHub",
	pnpPollMinutesInterval: 1,

	spotSources: new Map<DataSource, SpotSource>([
		[
			DataSource.WWFF,
			{
				baseHref: "https://spots.wwff.co/static/spots.json",
				pollIntervalMinutes: 1,
				siteFilter: "^(?:VKFF|ZLFF)",
			},
		],
		[
			DataSource.SOTA,
			{
				baseHref: "https://api-db2.sota.org.uk/api/",
				pollIntervalMinutes: 1,
				siteFilter: "^(?:VK|ZL)",
			},
		],
		[
			DataSource.POTA,
			{
				baseHref: "https://api.pota.app/spot/activator/",
				pollIntervalMinutes: 1,
				siteFilter: "^(?:AU|NZ)",
			},
		],
		[
			DataSource.ZLOTA,
			{
				baseHref: "https://ontheair.nz/",
				pollIntervalMinutes: 1,
				siteFilter: "^(?:AU|NZ)",
			},
		],
		[
			DataSource.PNP,
			{
				baseHref: "https://rhinoswtools.azurewebsites.net/PnPProxy?suffix=",
				pollIntervalMinutes: 1,
				siteFilter: "^(?:VK|VL|VJ|VI|ZL|ZZ)",
			},
		],
	]),
	maxSpotAgeMinutes: 120,
};
