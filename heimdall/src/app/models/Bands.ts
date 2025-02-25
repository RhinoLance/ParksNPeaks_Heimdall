export class Bands {
	public static m160: IFrequencyBand = { name: "160m", start: 1.8, end: 2.0 };
	public static m80: IFrequencyBand = { name: "80m", start: 3.5, end: 4.0 };
	public static m60: IFrequencyBand = { name: "60m", start: 5.3, end: 5.5 };
	public static m40: IFrequencyBand = { name: "40m", start: 7.0, end: 7.3 };
	public static m30: IFrequencyBand = { name: "30m", start: 10.1, end: 10.15 };
	public static m20: IFrequencyBand = { name: "20m", start: 14.0, end: 14.35 };
	public static m17: IFrequencyBand = {
		name: "17m",
		start: 18.068,
		end: 18.168,
	};
	public static m15: IFrequencyBand = { name: "15m", start: 21.0, end: 21.45 };
	public static m12: IFrequencyBand = { name: "12m", start: 24.89, end: 24.99 };
	public static m10: IFrequencyBand = { name: "10m", start: 28.0, end: 29.7 };
	public static m6: IFrequencyBand = { name: "6m", start: 50.0, end: 54.0 };
	public static m4: IFrequencyBand = { name: "4m", start: 70.0, end: 70.5 };
	public static m2: IFrequencyBand = { name: "2m", start: 144.0, end: 148.0 };
	public static cm70: IFrequencyBand = {
		name: "70cm",
		start: 430.0,
		end: 440.0,
	};
	public static cm23: IFrequencyBand = {
		name: "23cm",
		start: 1240.0,
		end: 1300.0,
	};
	public static cm13: IFrequencyBand = {
		name: "13cm",
		start: 2300.0,
		end: 2450.0,
	};
	public static cm9: IFrequencyBand = {
		name: "9cm",
		start: 3400.0,
		end: 3475.0,
	};
	public static cm6: IFrequencyBand = {
		name: "6cm",
		start: 5650.0,
		end: 5850.0,
	};
	public static cm3: IFrequencyBand = {
		name: "3cm",
		start: 10000.0,
		end: 10500.0,
	};
	public static mm12: IFrequencyBand = {
		name: "12mm",
		start: 24000.0,
		end: 24250.0,
	};
	public static mm6: IFrequencyBand = {
		name: "6mm",
		start: 47000.0,
		end: 47200.0,
	};
	public static mm3: IFrequencyBand = {
		name: "4mm",
		start: 76000000.0,
		end: 81000000.0,
	};

	public static Microwave: IFrequencyBand = {
		name: "Microwave",
		start: 1240,
		end: 250000000,
	};
}

export interface IFrequencyBand {
	name: string;
	start: number;
	end: number;
}
