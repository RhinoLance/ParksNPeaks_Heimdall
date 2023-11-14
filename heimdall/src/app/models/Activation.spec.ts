import { Activation, HideState } from "./Activation";
import { ActivationAward } from "./ActivationAward";
import { ActivationAwardList } from "./ActivationAwardList";
import { AwardScheme } from "./AwardScheme";
import { Callsign } from "./Callsign";
import { Guid } from "./Guid";
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

	it("It should return spots", () => {
		// Arrange
		const spot = new Spot();
		const activation = new Activation(spot);

		// Act
		const spots = activation.spots;

		// Assert
		expect(spots.length).toBe(1);
	});

	it("It should ignore duplicate spots", () => {
		// Arrange
		const spot1 = new Spot();
		const spot2 = new Spot();
		spot2.time = spot1.time;

		const activation = new Activation(spot1);

		// Act
		const added = activation.addSpot(spot2);

		// Assert
		expect(added).toBe(false);
	});

	it("It gets superseeded spots", () => {
		// Arrange
		const spot1 = new Spot();
		spot1.siteName = "first";

		const spot2 = new Spot();
		const spot3 = new Spot();
		spot2.time = spot2.time.addMinutes(10);
		spot3.time = spot3.time.addMinutes(15);

		const activation = new Activation(spot1);
		activation.addSpot(spot2);
		activation.addSpot(spot3);

		// Act
		const superseeded = activation.getSupersededSpots();

		// Assert
		expect(superseeded[0].siteName).toEqual("first");
	});

	it("It gets superseeded spots when added in wrong order", () => {
		// Arrange
		const spot1 = new Spot();
		spot1.siteName = "first";

		const spot2 = new Spot();
		const spot3 = new Spot();
		spot2.time = spot2.time.addMinutes(15);
		spot3.time = spot3.time.addMinutes(10);

		const activation = new Activation(spot3);
		activation.addSpot(spot2);
		activation.addSpot(spot1);

		// Act
		const superseeded = activation.getSupersededSpots();

		// Assert
		expect(superseeded[0].siteName).toEqual("first");
	});

	describe("Testing if spots are part of the same activation", () => {
		const spotTemplate = new Spot();
		spotTemplate.callsign = new Callsign("VK1AD");
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
			spot2.callsign = new Callsign("VK3OOO");
			spot2.awardList = new ActivationAwardList();

			// Act
			const activation = new Activation(spotTemplate);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(false);
		});

		it("Different site, same award", () => {
			// Arrange
			const spot1 = spotTemplate.clone();
			const spot2 = spotTemplate.clone();

			spot1.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.SOTA, "VK/AC-999")
			);

			spot2.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.SOTA, "VK/AC-111")
			);

			// Act
			const activation = new Activation(spot1);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(false);
		});

		it("Wrong name", () => {
			// Arrange
			const spot1 = spotTemplate.clone();
			const spot2 = spotTemplate.clone();
			spot2.siteName = "Wrong name";
			spot2.awardList = new ActivationAwardList();

			// Act
			const activation = new Activation(spot1);
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

		it("Different site and award, 31 min difference", () => {
			// Arrange
			const spot1 = spotTemplate.clone();
			const spot2 = spotTemplate.clone();
			spot1.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.WWFF, "VKFF-1111")
			);
			spot2.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.WWFF, "VKFF-8888")
			);
			spot2.time = spotTemplate.time.addMinutes(31);

			// Act
			const activation = new Activation(spot1);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(false);
		});

		it("Same site and award, 31 min difference", () => {
			// Arrange
			const spot2 = spotTemplate.clone();
			spot2.time = spotTemplate.time.addMinutes(31);

			// Act
			const activation = new Activation(spotTemplate);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(true);
		});

		it("Same award, different site, greater than 30 mins", () => {
			// Arrange
			const spot1 = spotTemplate.clone();
			const spot2 = spotTemplate.clone();

			spot1.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.WWFF, "VKFF-1111")
			);

			spot2.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.SOTA, "VKFF-9999")
			);
			spot2.time = spot2.time.addMinutes(31);

			// Act
			const activation = new Activation(spot1);
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
			const spot1 = spotTemplate.clone();
			const spot2 = spotTemplate.clone();

			spot1.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.WWFF, "VKFF-1111")
			);
			spot1.siteName = "Mt Stromlo";

			spot2.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.SOTA, "VKFF-9999")
			);
			spot2.siteName = "Stromlo reserve";
			spot2.time = spot2.time.addMinutes(10);

			// Act
			const activation = new Activation(spot1);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(true);
		});

		it("Same site", () => {
			// Arrange
			const spot1 = spotTemplate.clone();
			const spot2 = spotTemplate.clone();

			spot1.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.WWFF, "VKFF-1234")
			);

			spot2.awardList = new ActivationAwardList(
				new ActivationAward(AwardScheme.WWFF, "VKFF-1234")
			);
			spot2.siteName = "Stromlo reserve";

			// Act
			const activation = new Activation(spot1);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(true);
		});
	});

	describe("Spots with alt location", () => {
		const spotTemplate = new Spot();
		spotTemplate.callsign = new Callsign("VK1AD");
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
			const activation = new Activation(spot1);
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
		let spot1: Spot;

		beforeEach(() => {
			spot1 = new Spot();
			spot1.callsign = new Callsign("VK1AD");
			spot1.siteName = "Mt Stromlo";
			spot1.time = new Date(2020, 1, 1, 12, 0, 0);
			spot1.frequency = 7.032;
			spot1.mode = SpotMode.CW;

			spot1.awardList.add(new ActivationAward(AwardScheme.SOTA, "VK1/AC-042"));
		});

		it("Shoule be type: Spot", () => {
			// Arrange

			// Act
			const activation = new Activation(spot1);
			const addedSpot = activation.getLatestSpot();

			// Assert
			expect(addedSpot?.type).toBe(SpotType.Spot);
		});

		it("[same, same]] should be ReSpot", () => {
			// Arrange
			const spot2 = spot1.clone();
			spot2.time = spot2.time.addMinutes(1);

			// Act
			const activation = new Activation(spot1);
			activation.addSpot(spot2);
			const addedSpot = activation.getLatestSpot();

			// Assert
			expect(addedSpot.type).toBe(SpotType.Respot);
		});

		it("[diff, same, same] should be ReSpot", () => {
			// Arrange
			const spot2 = spot1.clone();
			spot2.time = spot2.time.addMinutes(1);
			spot2.frequency = 7.144; //new freq

			const spot3 = spot1.clone();
			spot3.time = spot3.time.addMinutes(2);
			spot3.frequency = 7.144; //new freq

			// Act
			const activation = new Activation(spot1);
			activation.addSpot(spot2);
			activation.addSpot(spot3);
			const addedSpot = activation.getLatestSpot();

			// Assert
			expect(addedSpot?.type).toBe(SpotType.Respot);
		});

		it("Check spotType per VK2EG sequence", () => {
			// Arrange
			type TestSpot = {
				id: Guid;
				frequency: number;
				mode: SpotMode;
				spotType: SpotType;
			};

			//test spots in order of how they were spotted
			const spotParamList: TestSpot[] = [
				{
					id: Guid.create(),
					frequency: 21.244,
					mode: SpotMode.SSB,
					spotType: SpotType.Spot,
				},
				{
					id: Guid.create(),
					frequency: 14.31,
					mode: SpotMode.SSB,
					spotType: SpotType.Spot,
				},
				{
					id: Guid.create(),
					frequency: 14.31,
					mode: SpotMode.SSB,
					spotType: SpotType.Respot,
				},
				{
					id: Guid.create(),
					frequency: 14.31,
					mode: SpotMode.DATA,
					spotType: SpotType.Spot,
				},
				{
					id: Guid.create(),
					frequency: 14.31,
					mode: SpotMode.SSB,
					spotType: SpotType.Spot,
				},
				{
					id: Guid.create(),
					frequency: 14.31,
					mode: SpotMode.SSB,
					spotType: SpotType.Respot,
				},

				{
					id: Guid.create(),
					frequency: 14.31,
					mode: SpotMode.SSB,
					spotType: SpotType.Respot,
				},
			];

			// Arrange
			const spotList: Spot[] = [];

			for (let cI = 0; cI < spotParamList.length; cI++) {
				const spotParams = spotParamList[cI];

				const spot = new Spot();
				spot.id = spotParams.id;
				spot.frequency = spotParams.frequency;
				spot.mode = spotParams.mode;
				spot.time = new Date().addMinutes(cI);

				spotList.push(spot);
			}

			// Act
			const activation = new Activation(spotList[0]);
			spotList.slice(1).map((v) => activation.addSpot(v));

			// Assert
			expect(activation.getLatestSpot().type)
				.withContext("latest Spot")
				.toBe(spotParamList[spotParamList.length - 1].spotType);

			activation.getSupersededSpots().map((v, i) => {
				const expectedType = spotParamList.find(
					(spl) => v.id == spl.id
				)!.spotType;

				expect(v.type)
					.withContext(`index: ${i}, freq: ${v.frequency}, mode: ${v.mode}`)
					.toBe(expectedType);
			});
		});

		it("Check spotType per VK2EG sequence out of order", () => {
			// Arrange
			type TestSpot = {
				id: Guid;
				frequency: number;
				mode: SpotMode;
				spotType: SpotType;
			};

			//test spots in order of how they were spotted
			const spotParamList: TestSpot[] = [
				{
					id: Guid.create(),
					frequency: 21.244,
					mode: SpotMode.SSB,
					spotType: SpotType.Spot,
				},
				{
					id: Guid.create(),
					frequency: 14.31,
					mode: SpotMode.SSB,
					spotType: SpotType.Spot,
				},
				{
					id: Guid.create(),
					frequency: 14.31,
					mode: SpotMode.SSB,
					spotType: SpotType.Respot,
				},
				{
					id: Guid.create(),
					frequency: 14.31,
					mode: SpotMode.DATA,
					spotType: SpotType.Spot,
				},
				{
					id: Guid.create(),
					frequency: 14.31,
					mode: SpotMode.SSB,
					spotType: SpotType.Spot,
				},
				{
					id: Guid.create(),
					frequency: 14.31,
					mode: SpotMode.SSB,
					spotType: SpotType.Respot,
				},

				{
					id: Guid.create(),
					frequency: 14.31,
					mode: SpotMode.SSB,
					spotType: SpotType.Respot,
				},
			];

			// Arrange
			const spotList: Spot[] = [];

			for (let cI = 0; cI < spotParamList.length; cI++) {
				const spotParams = spotParamList[cI];

				const spot = new Spot();
				spot.id = spotParams.id;
				spot.frequency = spotParams.frequency;
				spot.mode = spotParams.mode;
				spot.time = new Date().addMinutes(cI);

				spotList.push(spot);
			}

			// Act
			const order = [1, 3, 2, 6, 4, 5, 6];
			const activation = new Activation(spotList[order[0]]);
			order.slice(1).map((v) => activation.addSpot(spotList[v]));

			// Assert
			expect(activation.getLatestSpot().type)
				.withContext("latest Spot")
				.toBe(spotParamList[spotParamList.length - 1].spotType);

			activation.getSupersededSpots().map((v, i) => {
				const expectedType = spotParamList.find(
					(spl) => v.id == spl.id
				)!.spotType;

				expect(v.type)
					.withContext(`index: ${i}, freq: ${v.frequency}, mode: ${v.mode}`)
					.toBe(expectedType);
			});
		});

		it("Changing frequency should result in type: Spot", () => {
			// Arrange
			const spot2 = new Spot();
			spot2.callsign = new Callsign(spot1.callsign.root);
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
			spot2.callsign = new Callsign(spot1.callsign.root);
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

	describe("Spot visibility", () => {
		let spot1: Spot;
		let spot2: Spot;
		let activation: Activation;

		beforeEach(() => {
			spot1 = new Spot();
			spot2 = new Spot();
			spot2.time = spot2.time.addMinutes(10);
			activation = new Activation(spot1);
		});

		it("it should be visible after band change if spot hidden", () => {
			// Arrange
			activation.visibleState = HideState.Spot;
			spot1.frequency = 3.5;
			spot2.frequency = 7.144;

			// Act
			activation.addSpot(spot2);

			// Assert
			expect<HideState>(activation.visibleState).toBe(HideState.Visible);
		});

		it("it should be visible after mode change if spot hidden", () => {
			// Arrange
			activation.visibleState = HideState.Spot;
			spot1.mode = SpotMode.SSB;
			spot2.mode = SpotMode.CW;

			// Act
			activation.addSpot(spot2);

			// Assert
			expect<HideState>(activation.visibleState).toBe(HideState.Visible);
		});

		it("it should be remain hidden after mode or frequency change if activation hidden", () => {
			// Arrange
			activation.visibleState = HideState.Activation;

			spot1.frequency = 3.5;
			spot2.frequency = 7.144;

			spot1.mode = SpotMode.SSB;
			spot2.mode = SpotMode.CW;

			// Act
			activation.addSpot(spot2);

			// Assert
			expect(activation.visibleState).toBe(HideState.Activation);
		});
	});
});
