export enum AwardScheme {
	BOTA,
	DXCluster,
	HEMA,
	ILLW,
	IOTA,
	JOTA,
	KRNMPA,
	Other,
	POTA,
	QRP,
	SANPCPA,
	SiOTA,
	VK_Shires,

	VK_WWFF,
	ZL_WWFF,
	VKFF,
	WWFF,

	SOTA,
	VK_SOTA,
	ZL_SOTA,

	ZLOTA,
	ZLOTA_ISLAND,
	ZLOTA_PARK,
	ZLOTA_HUT,
	ZLOTA_LIGHTHOUSE,
	ZLOTA_LAKE,
	ZLOTA_HUMP,
	ZLOTA_VOLCANO,
	ZLOTA_SILO,
	ZLOTA_LLOTA_LAKE,
}

export function awardSchemeToName(awardScheme: AwardScheme): string {
	switch (awardScheme) {
		case AwardScheme.BOTA:
			return "BOTA";
		case AwardScheme.DXCluster:
			return "DX Cluster";
		case AwardScheme.HEMA:
			return "HEMA";
		case AwardScheme.ILLW:
			return "ILLW";
		case AwardScheme.IOTA:
			return "IOTA";
		case AwardScheme.JOTA:
			return "JOTA";
		case AwardScheme.KRNMPA:
			return "KRNMPA";
		case AwardScheme.Other:
			return "Other";
		case AwardScheme.POTA:
			return "POTA";
		case AwardScheme.QRP:
			return "QRP";
		case AwardScheme.SANPCPA:
			return "SANPCPA";
		case AwardScheme.SiOTA:
			return "SiOTA";
		case AwardScheme.VK_Shires:
			return "VK Shires";

		case AwardScheme.VK_WWFF:
		case AwardScheme.ZL_WWFF:
		case AwardScheme.VKFF:
		case AwardScheme.WWFF:
			return "WWFF";

		case AwardScheme.SOTA:
		case AwardScheme.VK_SOTA:
		case AwardScheme.ZL_SOTA:
			return "SOTA";

		case AwardScheme.ZLOTA:
		case AwardScheme.ZLOTA_ISLAND:
		case AwardScheme.ZLOTA_PARK:
		case AwardScheme.ZLOTA_HUT:
		case AwardScheme.ZLOTA_LIGHTHOUSE:
		case AwardScheme.ZLOTA_LAKE:
		case AwardScheme.ZLOTA_HUMP:
		case AwardScheme.ZLOTA_VOLCANO:
		case AwardScheme.ZLOTA_SILO:
		case AwardScheme.ZLOTA_LLOTA_LAKE:
			return "ZLOTA";

		default:
			return "Unknown";
	}
}

export const awardSchemeRegexMap = new Map<AwardScheme, RegExp>([
	[AwardScheme.SOTA, /(?:VK|ZL)[0-9]{1,3}\/[A-Z]{1,3}-\d+/i],
	[AwardScheme.VKFF, /VKFF-\d{4}/i],
	[AwardScheme.ZL_WWFF, /ZLFF-\d{4}/i],
	[AwardScheme.POTA, /(?:AU|NZ)-\d{4}/i],

	[AwardScheme.ZLOTA_ISLAND, /^ZLI\/.*$/i],
	[AwardScheme.ZLOTA_PARK, /^ZLP\/.*$/i],
	[AwardScheme.ZLOTA_HUT, /^ZLH\/.*$/i],
	[AwardScheme.ZLOTA_LIGHTHOUSE, /^ZLB\/.*$/i],
	[AwardScheme.ZLOTA_LAKE, /^ZLL\/.*$/i],
	[AwardScheme.ZLOTA_HUMP, /^ZL.\/H..-.*$/i],
	[AwardScheme.ZLOTA_VOLCANO, /^ZLV\/.*$/i],
	[AwardScheme.ZLOTA_LLOTA_LAKE, /^..LL-....$/i],

	[AwardScheme.ZLOTA, /^(?:ZL)[A-Z0-9][/-].*$/i],
]);

/*
export class AwardScheme {
	public static BOTA: string = "BOTA";
	public static DXCluster: string = "DXCluster";
	public static HEMA: string = "HEMA";
	public static ILLW: string = "ILLW";
	public static IOTA: string = "IOTA";
	public static JOTA: string = "JOTA";
	public static KRNMPA: string = "KRNMPA";
	public static Other: string = "OTHER";
	public static POTA: string = "POTA";
	public static QRP: string = "QRP";
	public static SANPCPA: string = "SANPCPA";
	public static SiOTA: string = "SiOTA";
	public static VK_Shires: string = "VK Shires";

	public static ZL_OTA: string = "ZLOTA";
	public static ZLOTA: string = "ZLOTA";

	public static VK_WWFF: string = "WWFF";
	public static ZL_WWFF: string = "WWFF";
	public static VKFF: string = "WWFF";
	public static WWFF: string = "WWFF";

	public static SOTA: string = "SOTA";
	public static VK_SOTA: string = "SOTA";
	public static ZL_SOTA: string = "SOTA";

	public static ZLOTA_ISLAND: string = "ZL_Island";
	public static ZLOTA_PARK: string = "ZL_Park";
	public static ZLOTA_HUT: string = "ZL_Hut";
	public static ZLOTA_LIGHTHOUSE: string = "ZL_Lighthouse";
	public static ZLOTA_LAKE: string = "ZL_Lake";
	public static ZLOTA_HUMP: string = "ZL_Hump";
	public static ZLOTA_VOLCANO: string = "ZL_Volcano";
	public static ZLOTA_SILO: string = "ZL_Silo";
	public static ZLOTA_LLOTA_LAKE: string = "ZL_Lake";
}
*/
