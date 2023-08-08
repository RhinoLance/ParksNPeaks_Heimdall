import { ActivationAward } from "./ActivationAward";
import { ActivationAwardList } from "./ActivationAwardList";
import { AwardScheme } from "./AwardScheme";
import { Spot } from "./Spot";
import { SpotMode } from "./SpotMode";
import { SpotType } from "./SpotType";

describe("Spot", () => {
	const spotTemplate = new Spot();
	spotTemplate.type = SpotType.Spot;
	spotTemplate.tPlusMinutes = 0;
	spotTemplate.callsign = "VK3WMD/P";
	spotTemplate.callsignRoot = "VK3WMD";
	spotTemplate.comment = "Cq @1030 local time  *[iPnP] [VK3WMD]";
	spotTemplate.frequency = 7.09;
	spotTemplate.mode = SpotMode.SSB;
	spotTemplate.siteName = "Big Hill";
	spotTemplate.spotter = "VK3WMD";
	spotTemplate.time = new Date("2023-07-04 00:28:00");
	spotTemplate.awardList = new ActivationAwardList(
		new ActivationAward(AwardScheme.WWFF, "VKFF-0344"),
		new ActivationAward(AwardScheme.POTA, "VK-8888")
	);

	describe("PrimaryAward", () => {
		it("Gets the primary award", () => {
			// Arrange
			const spot = spotTemplate.clone();

			// Act
			const result = spot.primaryAward;

			// Assert
			expect(result).toEqual(AwardScheme.WWFF);
		});
	});

	describe("PrimarySiteId", () => {
		it("Gets the primary siteId", () => {
			// Arrange
			const spot = spotTemplate.clone();

			// Act
			const result = spot.primarySiteId;

			// Assert
			expect(result).toEqual("VKFF-0344");
		});
	});

	describe("shortTime", () => {
		it("first query of short time", () => {
			// Arrange
			const spot = spotTemplate.clone();

			// Act
			const result = spot.shortTime;

			// Assert
			expect(result).toEqual("00:28");
		});

		it("second call of short time", () => {
			// Arrange
			const spot = spotTemplate.clone();

			// Act
			spot.shortTime;
			const result = spot.shortTime;

			// Assert
			expect(result).toEqual("00:28");
		});
	});
});
