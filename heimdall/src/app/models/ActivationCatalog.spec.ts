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

	it("Adds spot to an existing activation", () => {
		// Arrange
		const spot1 = new Spot();
		spot1.mode = SpotMode.CW;

		const spot2 = new Spot();
		spot1.mode = SpotMode.SSB;

		const ac = new ActivationCatalogue();

		// Act
		ac.addSpot(spot1);
		ac.addSpot(spot2);

		// Assert
		expect(ac.activations.length).toEqual(1);
	});

	it("Adds multiple spots to single activation", () => {
		// Arrange
		const spot1 = new Spot();
		spot1.mode = SpotMode.CW;

		const spot2 = new Spot();
		spot1.mode = SpotMode.SSB;

		const ac = new ActivationCatalogue();

		// Act
		ac.addSpots([spot1, spot2]);

		// Assert
		expect(ac.activations.length).toEqual(1);
	});
});
