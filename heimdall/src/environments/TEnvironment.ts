export type Environment = {
	potaBaseHref: string;
	pnpBaseHref: string;
	zlotaBaseHref: string;
	heimdallHubUrl: string;
	pnpPollMinutesInterval: number;
	production: boolean;
	name: EnvironmentName;
};

export enum EnvironmentName {
	Empty = "empty",
	Prod = "prod",
	LocalServer = "localServer",
	Dev = "dev",
}
