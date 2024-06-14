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
}

const regexSota = /(?:VK|ZL)[0-9]{1,3}\/[A-Z]{1,3}-\d+/i;
const regexVkff = /VKFF-\d{4}/i;
const regexZlff = /ZLFF-\d{4}/i;
const regexPota = /(?:AU|NZ)-\d{4}/i;

export {regexPota, regexSota, regexVkff, regexZlff}
