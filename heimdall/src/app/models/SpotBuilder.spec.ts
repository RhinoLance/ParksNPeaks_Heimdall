import { AwardScheme } from "./AwardScheme";
import { PnPSpot } from "./PnPSpot";
import { SpotBuilder } from "./SpotBuilder";

describe("SpotBuilder", () => {
	describe("Multiple sites", () => {
		const pnpSpot: PnPSpot = {
			actTime: "2023-07-04 00:28:00",
			actID: "2114006",
			actSiteID: "VK4/SE-114",
			actCallsign: "VK3WMD/P",
			actMode: "SSB",
			actFreq: "7.090",
			actClass: "SOTA",
			altClass: "VKFF",
			actLocation: "VK4/SE-114",
			altLocation: "VKFF-0344 Mount Coolum National Park",
			actComments: "Cq @1030 local time  *[iPnP] [VK3WMD]",
			actSpoter: "VK3WMD",
			WWFFid: "VKFF-0344",
		};

		it("Gets the correct siteName", () => {
			// Arrange

			// Act
			const spot = new SpotBuilder().addPnpSpot(pnpSpot).build();

			// Assert
			expect(spot.siteName).toEqual(pnpSpot.altLocation);
		});

		it("Gets the correct altAward", () => {
			// Arrange

			// Act
			const spot = new SpotBuilder().addPnpSpot(pnpSpot).build();

			// Assert
			expect(spot.awardList.getAtIndex(1).award).toEqual(AwardScheme.VKFF);
		});

		it("Gets the correct altSiteId", () => {
			// Arrange

			// Act
			const spot = new SpotBuilder().addPnpSpot(pnpSpot).build();

			// Assert
			expect(spot.awardList.getAtIndex(1).siteId).toEqual("VKFF-0344");
		});
	});

	describe("Invalid states", () => {
		it("should throw an error if no PnPSpot is provided", () => {
			// Arrange
			const builder = new SpotBuilder();

			// Act
			let threwError = false;

			try {
				builder.build();
			} catch (e) {
				threwError = true;
			}

			// Assert
			expect(threwError).toEqual(true);
		});
	});
});
