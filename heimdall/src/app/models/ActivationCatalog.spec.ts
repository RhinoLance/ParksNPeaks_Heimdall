import { ActivationCatalogue } from "./ActivationCatalogue";
import { Spot } from "./Spot";
import { SpotMode } from "./SpotMode";

describe("Activation Catalogue", () => {
	it("Adds spot to new activation", () => {
		// Arrange
		const ac = new ActivationCatalogue();

		// Act
		ac.addSpot(new Spot());

		// Assert
		expect(ac.activations.length).toEqual(1);
	});

	it("Adds spot to new activation return the activation", () => {
		// Arrange
		const ac = new ActivationCatalogue();

		// Act
		const activation = ac.addSpot(new Spot());

		// Assert
		expect(activation).toBeTruthy();
	});

	it("Adds spot to an existing activation", () => {
		// Arrange
		const spot1 = new Spot();
		spot1.mode = SpotMode.CW;

		const spot2 = new Spot();
		spot2.mode = SpotMode.SSB;

		const ac = new ActivationCatalogue();

		// Act
		ac.addSpot(spot1);
		ac.addSpot(spot2);

		// Assert
		expect(ac.activations.length).toEqual(1);
	});

	it("Adds spot to an existing activation returns activation", () => {
		// Arrange
		const spot1 = new Spot();
		spot1.mode = SpotMode.CW;

		const spot2 = new Spot();
		spot2.mode = SpotMode.SSB;
		spot2.time = spot2.time.addMinutes(1);

		const ac = new ActivationCatalogue();

		// Act
		ac.addSpot(spot1);
		const activation = ac.addSpot(spot2);

		// Assert
		expect(activation).toBeTruthy();
	});

	it("Adds multiple spots to single activation", () => {
		// Arrange
		const spot1 = new Spot();
		spot1.mode = SpotMode.CW;

		const spot2 = new Spot();
		spot2.mode = SpotMode.SSB;

		const ac = new ActivationCatalogue();

		// Act
		ac.addSpots([spot1, spot2]);

		// Assert
		expect(ac.activations.length).toEqual(1);
	});

	it("Adds multiple spots to single activation returns activation", () => {
		// Arrange
		const spot1 = new Spot();
		spot1.mode = SpotMode.CW;

		const spot2 = new Spot();
		spot2.mode = SpotMode.SSB;

		const ac = new ActivationCatalogue();

		// Act
		const activations = ac.addSpots([spot1, spot2]);

		// Assert
		expect(activations.length).toBeGreaterThan(0);
	});

	it("Adds multiple spots to seperate activations returns activations", () => {
		// Arrange
		const spot1 = new Spot();
		spot1.mode = SpotMode.CW;
		spot1.callsign = "G4OBK";
		spot1.callsignRoot = "G4OBK";

		const spot2 = new Spot();
		spot2.mode = SpotMode.SSB;
		spot2.callsign = "VK2IO";
		spot2.callsignRoot = "VK2IO";

		const ac = new ActivationCatalogue();

		// Act
		const activations = ac.addSpots([spot1, spot2]);

		// Assert
		expect(activations.length).toEqual(2);
	});
});
