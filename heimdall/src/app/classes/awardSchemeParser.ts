import { ActivationAward } from "../models/ActivationAward";
import { awardSchemeRegexMap } from "../models/AwardScheme";

export class AwardSchemeParser {
	private _searchString = "";

	public constructor(string: string) {
		this._searchString = string;
	}

	public parse(): ActivationAward[] {
		const retVal: ActivationAward[] = [];

		if (this._searchString === "") {
			return retVal;
		}

		awardSchemeRegexMap.forEach((regex, scheme) => {
			const matches = this._searchString.match(regex);
			if (matches != null) {
				retVal.push(new ActivationAward(scheme, matches[0].toUpperCase()));
			}
		});

		return retVal;
	}
}
