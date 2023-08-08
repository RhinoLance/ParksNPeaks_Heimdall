import { ActivationCatalogue } from "./ActivationCatalogue";
import { Spot } from "./Spot";
import { TimeUpdator, TimeUpdatorDate } from "./TimeUpdator";

describe("TimeUpdator", () => {
	it("It should add a spot", () => {
		// Arrange
		const date = new TimeUpdatorDate();
		spyOn(date, "currentTimeStamp").and.returnValue(1000 * 60 * 5);

		const spot = new Spot();
		spot.time = new Date(1000);

		const catalogue = new ActivationCatalogue();
		catalogue.addSpot(spot);

		const updator = new TimeUpdator(catalogue, 1, date);

		// Act
		updator.start();
		updator.stop();

		// Assert
		expect(spot.tPlusMinutes).toBe(5);
	});

	fit("It should update a spot after interval", () => {
		// Arrange
		const date = new TimeUpdatorDate();
		spyOn(date, "currentTimeStamp").and.returnValues(
			1000 * 60 * 5, //3000
			1000 * 60 * 10, //6000
			1000 * 60 * 15, //9000
			1000 * 60 * 20, //12000
			1000 * 60 * 25, //15000
			1000 * 60 * 30, //18000
			1000 * 60 * 35, //21000
			1000 * 60 * 40 //24000
		);

		const spot = new Spot();
		spot.time = new Date(1000);

		const catalogue = new ActivationCatalogue();
		catalogue.addSpot(spot);

		const updator = new TimeUpdator(catalogue, 1 / 60 / 4, date);

		jasmine.clock().install();

		// Act
		updator.start();
		jasmine.clock().tick(300);
		updator.stop();

		jasmine.clock().uninstall();

		// Assert
		expect(spot.tPlusMinutes).toBe(10);
	});
});
