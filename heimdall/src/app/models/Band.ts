export enum Band {
	M160 = "160m",
	M80 = "80m",
	M60 = "60m",
	M40 = "40m",
	M30 = "30m",
	M20 = "20m",
	M17 = "17m",
	M15 = "15m",
	M12 = "12m",
	M10 = "10m",
	M6 = "6m",
	M4 = "4m",
	M2 = "2m",
	CM70 = "70cm",
	CM23 = "23cm",
	CM13 = "13cm",
	CM9 = "9cm",
	CM6 = "6cm",
	CM3 = "3cm",
	MM12 = "12mm",
	MM6 = "6mm",
	MM3 = "4mm",
	Microwave = "Microwave",
}

export const frequencyBands: IFrequencyBand[] = [
	{ band: Band.M160, lower: 1.8, upper: 2.0 },
	{ band: Band.M80, lower: 3.5, upper: 4.0 },
	{ band: Band.M60, lower: 5.3, upper: 5.5 },
	{ band: Band.M40, lower: 7.0, upper: 7.3 },
	{ band: Band.M30, lower: 10.1, upper: 10.15 },
	{ band: Band.M20, lower: 14.0, upper: 14.35 },
	{ band: Band.M17, lower: 18.068, upper: 18.168 },
	{ band: Band.M15, lower: 21.0, upper: 21.45 },
	{ band: Band.M12, lower: 24.89, upper: 24.99 },
	{ band: Band.M10, lower: 28.0, upper: 29.7 },
	{ band: Band.M6, lower: 50.0, upper: 54.0 },
	{ band: Band.M4, lower: 70.0, upper: 70.5 },
	{ band: Band.M2, lower: 144.0, upper: 148.0 },
	{ band: Band.CM70, lower: 430.0, upper: 440.0 },
	{ band: Band.CM23, lower: 1240.0, upper: 1300.0 },
	{ band: Band.CM13, lower: 2300.0, upper: 2450.0 },
	{ band: Band.CM9, lower: 3400.0, upper: 3475.0 },
	{ band: Band.CM6, lower: 5650.0, upper: 5850.0 },
	{ band: Band.CM3, lower: 10000.0, upper: 10500.0 },
	{ band: Band.MM12, lower: 24000.0, upper: 24250.0 },
	{ band: Band.MM6, lower: 47000.0, upper: 47200.0 },
	{ band: Band.MM3, lower: 76000000.0, upper: 81000000.0 },
	{ band: Band.Microwave, lower: 1240, upper: 250000000 },
];

export interface IFrequencyBand {
	band: Band;
	lower: number;
	upper: number;
}
