export enum SpotMode {
	SSB = "SSB",
	CW = "CW",
	FM = "FM",
	AM = "AM",
	DATA = "DATA",
	FT4 = "FT4",
	FT8 = "FT8",
	Other = "Other",
}

const spotModeList: SpotMode[] = [
	SpotMode.SSB,
	SpotMode.CW,
	SpotMode.FM,
	SpotMode.AM,
	SpotMode.DATA,
	SpotMode.FT4,
	SpotMode.FT8,
	SpotMode.Other,
];

export { spotModeList };
