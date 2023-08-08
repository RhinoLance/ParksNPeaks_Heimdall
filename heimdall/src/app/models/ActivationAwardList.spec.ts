import { ActivationAward } from "./ActivationAward";
import { ActivationAwardList } from "./ActivationAwardList";
import { AwardScheme } from "./AwardScheme";

describe("ActivationAwardList", () => {
	describe("Mirrors Array Methods", () => {
		const testList = new ActivationAwardList(
			new ActivationAward(AwardScheme.WWFF, "VKFF-1234"),
			new ActivationAward(AwardScheme.SOTA, "VK7/SW-1234"),
			new ActivationAward(AwardScheme.ZLOTA, "ZL-1234"),
			new ActivationAward(AwardScheme.BOTA, "BB-1234")
		);

		it("Has a length property", () => {
			// Arrange

			// Act

			// Assert
			expect(testList.length).toBe(4);
		});

		it("Can add elements", () => {
			// Arrange
			const list = testList.clone();

			// Act
			list.add(new ActivationAward(AwardScheme.BOTA, "BB-1234"));

			// Assert
			expect(list.length).toBe(5);
		});

		it("Is Iterable", () => {
			// Arrange
			const list = new ActivationAwardList(
				new ActivationAward(AwardScheme.WWFF, "VKFF-1234"),
				new ActivationAward(AwardScheme.SOTA, "VK7/SW-1234")
			);

			// Act
			let awards = "";

			for (const item of list) {
				awards += item.award;
			}

			// Assert
			expect(awards).toBe("WWFFSOTA");
		});

		describe("ContainsAward", () => {
			it("finds matching award", () => {
				// Arrange
				const list = testList.clone();

				// Act
				const result = list.containsAward(AwardScheme.WWFF);

				// Assert
				expect(result).toBe(true);
			});

			it("finds multiple matching awards", () => {
				// Arrange
				const list = testList.clone();

				// Act
				const result = list.containsAward(AwardScheme.WWFF, AwardScheme.SOTA);

				// Assert
				expect(result).toBe(true);
			});

			it("finds matching subsequent matching award in list", () => {
				// Arrange
				const list = testList.clone();

				// Act
				const result = list.containsAward(AwardScheme.HEMA, AwardScheme.SOTA);

				// Assert
				expect(result).toBe(true);
			});

			it("does not find missing award", () => {
				// Arrange
				const list = testList.clone();

				// Act
				const result = list.containsAward(AwardScheme.HEMA);

				// Assert
				expect(result).toBe(false);
			});
		});
	});
});
