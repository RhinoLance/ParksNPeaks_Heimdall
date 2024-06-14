import { AwardScheme } from "./AwardScheme";
import { PnPSpot } from "./PnPSpot";
import { SpotBuilder } from "./SpotBuilder";

describe("SpotBuilder", () => {
	describe("Multiple sites", () => {
		let pnpSpotTemplate: PnPSpot;

		beforeEach(() => {
			pnpSpotTemplate = {
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
		});

		it("Gets the correct siteName", () => {
			// Arrange

			// Act
			const spot = new SpotBuilder().addPnpSpot(pnpSpotTemplate).build();

			// Assert
			expect(spot.siteName).toEqual(pnpSpotTemplate.altLocation);
		});

		it("Gets the correct altAward", () => {
			// Arrange

			// Act
			const spot = new SpotBuilder().addPnpSpot(pnpSpotTemplate).build();

			// Assert
			expect(spot.awardList.getAtIndex(1).award).toEqual(AwardScheme.VKFF);
		});

		it("Gets the correct altSiteId", () => {
			// Arrange

			// Act
			const spot = new SpotBuilder().addPnpSpot(pnpSpotTemplate).build();

			// Assert
			expect(spot.awardList.getAtIndex(1).siteId).toEqual("VKFF-0344");
		});

		it("non WWFF altClass", () => {
			// Arrange
			const pnpSpot = JSON.parse(JSON.stringify(pnpSpotTemplate));
			pnpSpot.altClass = "POTA";
			pnpSpot.altLocation = ""; //clear this otherwise it will be used
			// Act
			const spot = new SpotBuilder().addPnpSpot(pnpSpot).build();

			// Assert
			expect(spot.awardList.length).toEqual(1);
		});

		it("no altLocation", () => {
			// Arrange
			const pnpSpot = JSON.parse(JSON.stringify(pnpSpotTemplate));
			pnpSpot.altLocation = "";
			pnpSpot.actLocation = "test";

			// Act
			const spot = new SpotBuilder().addPnpSpot(pnpSpot).build();

			// Assert
			expect(spot.siteName).toEqual("test");
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

	describe("Frequency transformation", () => {
		let pnpSpotTemplate: PnPSpot;

		beforeEach(() => {
			pnpSpotTemplate = {
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
		});

		it("should interpret a number", () => {
			// Arrange
			pnpSpotTemplate.actFreq = "7.090";

			// Act
			const builder = new SpotBuilder().addPnpSpot(pnpSpotTemplate);

			// Assert
			expect(builder.build().frequency).toEqual(7.09);
		});

		it("should ignore leading text", () => {
			// Arrange
			pnpSpotTemplate.actFreq = "ABC 7.090";

			// Act
			const builder = new SpotBuilder().addPnpSpot(pnpSpotTemplate);

			// Assert
			expect(builder.build().frequency).toEqual(7.09);
		});

		it("should ignore trailing text", () => {
			// Arrange
			pnpSpotTemplate.actFreq = "7.090ABC";

			// Act
			const builder = new SpotBuilder().addPnpSpot(pnpSpotTemplate);

			// Assert
			expect(builder.build().frequency).toEqual(7.09);
		});

		it("should extract the first number-like sequence", () => {
			// Arrange
			pnpSpotTemplate.actFreq = "7.ABC090";

			// Act
			const builder = new SpotBuilder().addPnpSpot(pnpSpotTemplate);

			// Assert
			expect(builder.build().frequency).toEqual(7);
		});

		it("should ignore period outisde of number sequence", () => {
			// Arrange
			pnpSpotTemplate.actFreq = ".7.ABC090";

			// Act
			const builder = new SpotBuilder().addPnpSpot(pnpSpotTemplate);

			// Assert
			expect(builder.build().frequency).toEqual(7);
		});
	});

	describe("Pick up single awardScheme from comments", () => {
		let pnpSpotTemplate: PnPSpot;

		beforeEach(() => {
			pnpSpotTemplate = {
				actTime: "2023-07-04 00:28:00",
				actID: "2114006",
				actSiteID: "VK4/SE-114",
				actCallsign: "VK3WMD/P",
				actMode: "SSB",
				actFreq: "7.090",
				actClass: "SOTA",
				altClass: "",
				actLocation: "VK4/SE-114",
				altLocation: "",
				actComments: "Cq @1030 local time also VKFF-1234 *[iPnP] [VK3WMD]",
				actSpoter: "VK3WMD",
				WWFFid: "VKFF-0344",
			};
		});

		it("should interpret a number", () => {
			// Arrange
			pnpSpotTemplate.actFreq = "7.090";

			// Act
			const builder = new SpotBuilder().addPnpSpot(pnpSpotTemplate);

			// Assert
			expect(builder.build().awardList.length).toEqual(2);
		});
	});

	describe("Pick up two awardSchemes from comments", () => {
		let pnpSpotTemplate: PnPSpot;

		beforeEach(() => {
			pnpSpotTemplate = {
				actTime: "2023-07-04 00:28:00",
				actID: "2114006",
				actSiteID: "VK4/SE-114",
				actCallsign: "VK3WMD/P",
				actMode: "SSB",
				actFreq: "7.090",
				actClass: "SOTA",
				altClass: "",
				actLocation: "VK4/SE-114",
				altLocation: "",
				actComments: "Cq @1030 local time also VKFF-1234 and AU-1234 *[iPnP] [VK3WMD]",
				actSpoter: "VK3WMD",
				WWFFid: "VKFF-0344",
			};
		});

		it("should interpret a number", () => {
			// Arrange
			pnpSpotTemplate.actFreq = "7.090";

			// Act
			const builder = new SpotBuilder().addPnpSpot(pnpSpotTemplate);

			// Assert
			expect(builder.build().awardList.length).toEqual(3);
		});
	});
});
