import { Activation } from "./Activation";
import { ActivationAward } from "./ActivationAward";
import { ActivationAwardList } from "./ActivationAwardList";
import { AwardScheme } from "./AwardScheme";
import { Spot } from "./Spot";
import { SpotMode } from "./SpotMode";
import { SpotType } from "./SpotType";

describe("Activation", () => {
	it("It should add a spot", () => {
		// Arrange
		const spot = new Spot();

		// Act
		const activation = new Activation(spot);

		// Assert
		expect(activation.spotCount).toBe(1);
	});

	describe("Testing if spots are part of the same activation", () => {
		const spotTemplate = new Spot();
		spotTemplate.callsignRoot = "VK1AD";
		spotTemplate.siteName = "Mt Stromlo";
		spotTemplate.time = new Date(2020, 1, 1, 12, 0, 0);
		spotTemplate.awardList.add(
			new ActivationAward(AwardScheme.SOTA, "VK1/AC-042")
		);

		it("Same callsignRoot, site and time", () => {
			// Arrange
			const spot1 = spotTemplate.clone();
			spot1.awardList = new ActivationAwardList();

			// Act
			const activation = new Activation(spotTemplate);
			const result = activation.isPartOfThisActivation(spot1);

			// Assert
			expect(result).toBe(true);
		});

		it("Different callsign", () => {
			// Arrange
			const spot2 = spotTemplate.clone();
			spot2.callsignRoot = "VK3OOO";
			spot2.awardList = new ActivationAwardList();

			// Act
			const activation = new Activation(spotTemplate);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(false);
		});

		it("Different site, same award", () => {
			// Arrange
			const spot2 = spotTemplate.clone();
			spot2.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.SOTA, "VK/AC-084")
			);

			// Act
			const activation = new Activation(spotTemplate);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(false);
		});

		it("Wrong name", () => {
			// Arrange
			const spot2 = spotTemplate.clone();
			spot2.siteName = "Wrong name";
			spot2.awardList = new ActivationAwardList();

			// Act
			const activation = new Activation(spotTemplate);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(true);
		});

		it("Different site and award, withing 5 minutes", () => {
			// Arrange
			const spot2 = spotTemplate.clone();
			spot2.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.WWFF, "VKFF-1234")
			);

			// Act
			const activation = new Activation(spotTemplate);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(true);
		});

		it("Different site and award, 30 min difference", () => {
			// Arrange
			const spot2 = spotTemplate.clone();
			spot2.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.WWFF, "VKFF-1234")
			);
			spot2.time = spotTemplate.time.addMinutes(31);

			// Act
			const activation = new Activation(spotTemplate);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(false);
		});

		it("Different award and site, different name", () => {
			// Arrange
			const spot2 = spotTemplate.clone();
			spot2.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.WWFF, "VKFF-1234")
			);
			spot2.siteName = "mt. barker";
			spot2.time = spotTemplate.time.addMinutes(10);

			// Act
			const activation = new Activation(spotTemplate);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(false);
		});

		it("Different award and site, similar name", () => {
			// Arrange
			const spot2 = spotTemplate.clone();
			spot2.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.WWFF, "VKFF-1234")
			);
			spot2.siteName = "Stromlo reserve";

			// Act
			const activation = new Activation(spotTemplate);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(true);
		});
	});

	describe("Spots with alt location", () => {
		const spotTemplate = new Spot();
		spotTemplate.callsignRoot = "VK1AD";
		spotTemplate.siteName = "Mt Stromlo";
		spotTemplate.time = new Date(2020, 1, 1, 12, 0, 0);
		spotTemplate.awardList.add(
			new ActivationAward(AwardScheme.SOTA, "VK1/AC-042")
		);

		it("Both award schemes added", () => {
			// Arrange
			const spot1 = spotTemplate.clone();
			spot1.awardList.add(new ActivationAward(AwardScheme.WWFF, "VKFF-1234"));

			// Act
			const activation = new Activation(spotTemplate);
			activation.addSpot(spot1);
			const awards = activation.awardList;

			// Assert
			expect(
				awards
					.toArray()
					.filter(
						(v) => v.award == AwardScheme.SOTA && v.siteId == "VK1/AC-042"
					).length
			).toBe(1);
			expect(
				awards
					.toArray()
					.filter((v) => v.award == AwardScheme.WWFF && v.siteId == "VKFF-1234")
					.length
			).toBe(1);
		});
	});

	describe("Set spot type correctly.", () => {
		const spot1 = new Spot();
		spot1.callsignRoot = "VK1AD";
		spot1.siteName = "Mt Stromlo";
		spot1.time = new Date(2020, 1, 1, 12, 0, 0);
		spot1.frequency = 7.032;
		spot1.mode = SpotMode.CW;

		spot1.awardList.add(new ActivationAward(AwardScheme.SOTA, "VK1/AC-042"));

		it("Shoule be type: Spot", () => {
			// Arrange

			// Act
			const activation = new Activation(spot1);
			const addedSpot = activation.getLatestSpot();

			// Assert
			expect(addedSpot?.type).toBe(SpotType.Spot);
		});

		fit("Subsequent spot with same freq and mode should be ReSpot", () => {
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = spot1.callsignRoot;
			spot2.siteName = spot1.siteName;
			spot2.time = spot1.time.addMinutes(1);
			spot2.frequency = spot1.frequency;
			spot2.mode = spot1.mode;

			// Act
			const activation = new Activation(spot1);
			activation.addSpot(spot2);
			const addedSpot = activation.getLatestSpot();

			// Assert
			expect(addedSpot?.type).toBe(SpotType.Respot);
		});

		it("Changing frequency should result in type: Spot", () => {
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = spot1.callsignRoot;
			spot2.siteName = spot1.siteName;
			spot2.time = spot1.time.addMinutes(1);
			spot2.frequency = 7.144;
			spot2.mode = spot1.mode;

			// Act
			const activation = new Activation(spot1);
			activation.addSpot(spot2);
			const addedSpot = activation.getLatestSpot();

			// Assert
			expect(addedSpot?.type).toBe(SpotType.Spot);
		});

		it("Changing mode should result in type: Spot", () => {
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = spot1.callsignRoot;
			spot2.siteName = spot1.siteName;
			spot2.time = spot1.time.addMinutes(1);
			spot2.frequency = 7.032;
			spot2.mode = SpotMode.FM;

			// Act
			const activation = new Activation(spot1);
			activation.addSpot(spot2);
			const addedSpot = activation.getLatestSpot();

			// Assert
			expect(addedSpot?.type).toBe(SpotType.Spot);
		});
	});
});
