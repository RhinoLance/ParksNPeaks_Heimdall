import { ActivationAward } from "../models/ActivationAward";
import { AwardScheme, regexPota, regexSota, regexVkff, regexZlff } from "../models/AwardScheme";

export class AwardSchemeParser {

	private _regexList = [
		{ regex: regexSota, scheme: AwardScheme.SOTA },
		{ regex: regexVkff, scheme: AwardScheme.VKFF },
		{ regex: regexZlff, scheme: AwardScheme.ZL_WWFF },
		{ regex: regexPota, scheme: AwardScheme.POTA }
	];

	private _searchString = "";

	public constructor( string: string ) {
		this._searchString = string;
	}

	public parse(): ActivationAward[] {
		
		const retVal: ActivationAward[] = [];

		if (this._searchString === "") {
			return retVal;
		}

		this._regexList.map( v => {
			const matches = this._searchString.match(v.regex);
			if (matches != null) {
				retVal.push( new ActivationAward( v.scheme, matches[0].toUpperCase() ) );
			}
		});

		return retVal;
		
	}
}