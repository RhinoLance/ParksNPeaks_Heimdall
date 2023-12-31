import { PnPSpot } from "./PnPSpot";
import { SpotListBuilder } from "./SpotListBuilder";

describe("SpotListBuilder", () => {
	const templateSpot: PnPSpot = {
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

	const clonePnPSpot = (spot: PnPSpot): PnPSpot =>
		JSON.parse(JSON.stringify(spot));

	it("creates a spotList", async () => {
		// Arrange
		const source = [clonePnPSpot(templateSpot)];

		// Act
		const slb = new SpotListBuilder();
		const spotList = slb.buildFromPnPSpots(source);

		// Assert
		expect(spotList).toHaveSize(1);
	});

	it("Orders DESC by default", async () => {
		// Arrange
		const spot1 = clonePnPSpot(templateSpot);
		spot1.actFreq = "7.000";
		spot1.actTime = "2023-07-04 00:28:00";

		const spot2 = clonePnPSpot(templateSpot);
		spot2.actFreq = "8.000";
		spot2.actTime = "2023-07-04 00:29:00";

		const source = [spot1, spot2];

		// Act
		const slb = new SpotListBuilder();
		const spotList = slb.buildFromPnPSpots(source);

		// Assert
		expect(spotList[0].frequency).toBe(8);
	});

	it("Orders ASC when set", async () => {
		// Arrange
		const spot1 = clonePnPSpot(templateSpot);
		spot1.actFreq = "7.000";
		spot1.actTime = "2023-07-04 00:28:00";

		const spot2 = clonePnPSpot(templateSpot);
		spot2.actFreq = "8.000";
		spot2.actTime = "2023-07-04 00:29:00";

		const source = [spot1, spot2];

		// Act
		const slb = new SpotListBuilder();
		slb.setSorting("ASC");
		const spotList = slb.buildFromPnPSpots(source);

		// Assert
		expect(spotList[0].frequency).toBe(7);
	});

	it("Orders DESC when set", async () => {
		// Arrange
		const spot1 = clonePnPSpot(templateSpot);
		spot1.actFreq = "7.000";
		spot1.actTime = "2023-07-04 00:28:00";

		const spot2 = clonePnPSpot(templateSpot);
		spot2.actFreq = "8.000";
		spot2.actTime = "2023-07-04 00:29:00";

		const source = [spot1, spot2];

		// Act
		const slb = new SpotListBuilder();
		slb.setSorting("DESC");
		const spotList = slb.buildFromPnPSpots(source);

		// Assert
		expect(spotList[1].frequency).toBe(7);
	});

	describe("correctly extracts frequency", () => {
		const testCases = [
			{ test: "7.090", expected: 7.09 },
			{ test: "ABC7.090", expected: 7.09 },
			{ test: "7.090ABC", expected: 7.09 },
			{ test: "7ABC.090", expected: 7 },
			{ test: "7.ABC090", expected: 7 },
			{ test: "7ABC090", expected: 7 },
			{ test: "ABC", expected: 0 },
		];

		testCases.forEach((testCase) => {
			it(`should extract ${testCase.expected} from ${testCase.test}`, () => {
				// Arrange
				const spot = clonePnPSpot(templateSpot);
				spot.actFreq = testCase.test;

				// Act
				const slb = new SpotListBuilder();
				const spotList = slb.buildFromPnPSpots([spot]);

				// Assert
				expect(spotList[0].frequency).toEqual(testCase.expected);
			});
		});
	});

	describe("strips sender from comments", () => {
		const testCases = [
			{ test: "this test [VK7ZA]", expected: "this test" },
			{ test: "this test [VK7ZA] [iPnP]", expected: "this test" },
			{ test: "this [VK7ZA] test", expected: "this test" },
			{ test: "this test VK portalog", expected: "this test" },
			{ test: "this test *[iPnP]", expected: "this test" },
			{ test: "this test SOTA Spotter", expected: "this test" },
			{ test: "this test [mParks]", expected: "this test" },
			{ test: "this test (via SMS)", expected: "this test" },
		];

		testCases.forEach((testCase) => {
			it(`should extract "${testCase.expected}" from "${testCase.test}"`, () => {
				// Arrange
				const spot = clonePnPSpot(templateSpot);
				spot.actComments = testCase.test;

				// Act
				const slb = new SpotListBuilder();
				const spotList = slb.buildFromPnPSpots([spot]);

				// Assert
				expect(spotList[0].comment).toEqual(testCase.expected);
			});
		});
	});
});
