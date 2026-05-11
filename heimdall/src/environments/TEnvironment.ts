export type Environment = {
	potaBaseHref: string;
	pnpBaseHref: string;
	zlotaBaseHref: string;
	wwffBaseHref: string;
	heimdallHubUrl: string;
	pnpPollMinutesInterval: number;
	production: boolean;
	name: EnvironmentName;

	maxSpotAgeMinutes: number;

	spotSources: Map<string, SpotSource>;
};

export interface SpotSource {
	baseHref: string;
	pollIntervalMinutes: number;
	siteFilter: string;
}

export enum EnvironmentName {
	Empty = "empty",
	Prod = "prod",
	LocalServer = "localServer",
	Dev = "dev",
}
