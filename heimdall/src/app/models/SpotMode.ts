export enum SpotMode {
	SSB = "SSB",
	CW = "CW",
	FM = "FM",
	AM = "AM",
	DATA = "DATA",
	FT4 = "FT4",
	FT8 = "FT8",
	QRT = "QRT",
	Other = "Other",
}

export const spotModeList: SpotMode[] = [
	SpotMode.SSB,
	SpotMode.CW,
	SpotMode.FM,
	SpotMode.AM,
	SpotMode.DATA,
	SpotMode.FT4,
	SpotMode.FT8,
	SpotMode.QRT,
	SpotMode.Other,
];

export function parseSpotMode(modeStr: string): SpotMode {
	const upperModeStr = modeStr.toUpperCase();
	if (upperModeStr in SpotMode) {
		return SpotMode[upperModeStr as keyof typeof SpotMode];
	}
	return SpotMode.Other;
}
