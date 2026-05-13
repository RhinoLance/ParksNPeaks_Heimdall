import { AwardSchemeParser } from "../classes/awardSchemeParser";
import { AwardScheme } from "./AwardScheme";

export class ActivationAward {
	public constructor(public award: AwardScheme, public siteId: string) {}

	public static fromSiteId(siteId: string): ActivationAward | null {
		const parser = new AwardSchemeParser(siteId);
		const awards = parser.parse();
		if (awards.length > 0) {
			return awards[0];
		}

		return new ActivationAward(AwardScheme.Other, siteId);
	}
}
