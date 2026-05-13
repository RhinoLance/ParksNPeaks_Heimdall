export interface IEnvironment {
	heimdallHubUrl: string;
	production: boolean;
	name: EnvironmentName;

	maxSpotAgeMinutes: number;

	spotSources: Map<DataSource, ISpotSource>;
}

export interface ISpotSource {
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

export enum DataSource {
	ZLOTA = "zlota",
	SOTA = "sota",
	WWFF = "wwff",
	PNP = "pnp",
	POTA = "pota",
}
