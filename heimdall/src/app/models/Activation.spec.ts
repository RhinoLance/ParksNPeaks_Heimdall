import { Activation } from "./Activation";
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

		const spot1 = new Spot();
		spot1.callsignRoot = "VK1AD";
		spot1.siteId = "VK1/AC-042";
		spot1.siteName = "Mt Stromlo";
		spot1.time = new Date(2020, 1, 1, 12, 0, 0);
		spot1.award = AwardScheme.SOTA;

		it( "Same callsignRoot, site and time", () => {
			
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = spot1.callsignRoot;
			spot2.siteId = spot1.siteId;
			spot2.siteName = spot1.siteName;
			spot2.time = spot1.time;
			spot2.award = spot1.award;

			// Act
			const activation = new Activation(spot1);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(true);
		});

		it( "Different callsign", () => {
			
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = "VK3OOO";
			spot2.siteId = spot1.siteId;
			spot2.siteName = spot1.siteName;
			spot2.time = spot1.time;
			spot2.award = spot1.award;

			// Act
			const activation = new Activation(spot1);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(false);
		});

		it( "Different site, same award", () => {
			
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = spot1.callsignRoot;
			spot2.siteId = "VK1/AC-084";
			spot2.siteName = spot1.siteName;
			spot2.time = spot1.time;
			spot2.award = spot1.award;

			// Act
			const activation = new Activation(spot1);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(false);
		});

		it( "Wrong name", () => {
			
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = spot1.callsignRoot;
			spot2.siteId = spot1.siteId;
			spot2.siteName = "Wrong name";
			spot2.time = spot1.time;
			spot2.award = spot1.award;

			// Act
			const activation = new Activation(spot1);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(true);
		});

		it( "Different site and award, withing 5 minutes", () => {
			
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = spot1.callsignRoot;
			spot2.siteId = "VKFF-1234";
			spot2.siteName = spot1.siteName;
			spot2.time = spot1.time.addMinutes(4);
			spot2.award = AwardScheme.WWFF;

			// Act
			const activation = new Activation(spot1);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(true);
		});
		
		it( "Different site and award, 30 min difference", () => {
			
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = spot1.callsignRoot;
			spot2.siteId = "VKFF-1234";
			spot2.siteName = spot1.siteName;
			spot2.time = spot1.time.addMinutes(31);
			spot2.award = AwardScheme.WWFF;

			// Act
			const activation = new Activation(spot1);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(false); 
		});
		

		it( "Different award and site, different name", () => {
			
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = spot1.callsignRoot;
			spot2.siteId = "VKFF-1234";
			spot2.siteName = "mt. barker";
			spot2.time = spot1.time.addMinutes(10);
			spot2.award = AwardScheme.WWFF;

			// Act
			const activation = new Activation(spot1);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(false);
		});
		

		it( "Different award and site, similar name", () => {
			
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = spot1.callsignRoot;
			spot2.siteId = "VKFF-1234";
			spot2.siteName = "Stromlo reserve";
			spot2.time = spot1.time.addMinutes(10);
			spot2.award = AwardScheme.WWFF;

			// Act
			const activation = new Activation(spot1);
			const result = activation.isPartOfThisActivation(spot2);

			// Assert
			expect(result).toBe(true);
		});
	});

	describe("Set spot type correctly.", () => {

		const spot1 = new Spot();
		spot1.callsignRoot = "VK1AD";
		spot1.siteId = "VK1/AC-042";
		spot1.siteName = "Mt Stromlo";
		spot1.time = new Date(2020, 1, 1, 12, 0, 0);
		spot1.award = AwardScheme.SOTA;
		spot1.frequency = 7.032;
		spot1.mode = SpotMode.CW;

		it( "Shoule be type: Spot", () => {
			
			// Arrange
			

			// Act
			const activation = new Activation(spot1);
			const addedSpot = activation.getLatestSpot();
			
			// Assert
			expect(addedSpot?.type).toBe(SpotType.Spot); 
		});

		it( "Subsequent spot with same freq and mode should be ReSpot", () => {
			
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = spot1.callsignRoot;
			spot2.siteId = spot1.siteId;
			spot2.siteName = spot1.siteName;
			spot2.time = spot1.time.addMinutes(1);
			spot2.award = spot1.award;
			spot2.frequency = spot1.frequency;
			spot2.mode = spot1.mode;

			// Act
			const activation = new Activation(spot1);
			activation.addSpot(spot2);
			const addedSpot = activation.getLatestSpot();
			
			// Assert
			expect(addedSpot?.type).toBe(SpotType.Respot); 
		});

		it( "Changing frequency should result in type: ReSpot", () => {
			
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = spot1.callsignRoot;
			spot2.siteId = spot1.siteId;
			spot2.siteName = spot1.siteName;
			spot2.time = spot1.time.addMinutes(1);
			spot2.award = spot1.award;
			spot2.frequency = 7.144;
			spot2.mode = spot1.mode;

			// Act
			const activation = new Activation(spot1);
			activation.addSpot(spot2);
			const addedSpot = activation.getLatestSpot();
			
			// Assert
			expect(addedSpot?.type).toBe(SpotType.Spot); 
		});

		it( "Changing mode should result in type: ReSpot", () => {
			
			// Arrange
			const spot2 = new Spot();
			spot2.callsignRoot = spot1.callsignRoot;
			spot2.siteId = spot1.siteId;
			spot2.siteName = spot1.siteName;
			spot2.time = spot1.time.addMinutes(1);
			spot2.award = spot1.award;
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
