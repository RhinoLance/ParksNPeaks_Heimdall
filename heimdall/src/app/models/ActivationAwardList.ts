import { ActivationAward } from "./ActivationAward";
import { AwardScheme } from "./AwardScheme";

export class ActivationAwardList implements Iterable<ActivationAward> {
	private _awardList: ActivationAward[] = [];

	public constructor(...activationAward: ActivationAward[]) {
		this._awardList.push(...activationAward);
	}

	public *[Symbol.iterator]() {
		yield* this._awardList;
	}

	public get length(): number {
		return this._awardList.length;
	}

	public clone(): ActivationAwardList {
		return new ActivationAwardList(...this._awardList);
	}

	public add(...award: ActivationAward[]): void {
		this._awardList.push(...award);
	}

	public getAtIndex(index: number): ActivationAward {
		return this._awardList[index];
	}

	public getSiteIds(): string[] {
		return this._awardList.map((aa) => aa.siteId);
	}

	public getAwards(): AwardScheme[] {
		return this._awardList.map((aa) => aa.award);
	}

	public toArray(): ActivationAward[] {
		return this._awardList;
	}

	public containsAward(...awardScheme: AwardScheme[]): boolean {
		let retVal = false;

		for (let cI = 0; cI < awardScheme.length; cI++) {
			if (
				this._awardList.find((aa) => aa.award == awardScheme[cI]) != undefined
			) {
				retVal = true;
				break;
			}
		}

		return retVal;
	}

	public containsSite(...siteId: string[]): boolean {
		let retVal = false;

		for (let cI = 0; cI < siteId.length; cI++) {
			if (this._awardList.find((aa) => aa.siteId == siteId[cI]) != undefined) {
				retVal = true;
				break;
			}
		}

		return retVal;
	}

	public containsDifferentSiteIdForSameAwardScheme(
		...activationAward: ActivationAward[]
	) {
		let retVal = false;

		for (let cI = 0; cI < activationAward.length; cI++) {
			const aa = activationAward[cI];
			if (
				this._awardList.find(
					(sa) => sa.award == aa.award && sa.siteId !== aa.siteId
				) != undefined
			) {
				retVal = true;
				break;
			}
		}

		return retVal;
	}
}
