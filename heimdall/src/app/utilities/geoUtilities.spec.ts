import { randomisePoint } from "./geoUtilities";

describe("GeoUtilities", () => {
	fdescribe("randomisePoint", () => {
		// Arrange
		const lat = 23.4561;
		const lng = 12.3451;

		// Act
		const result = randomisePoint(lat, lng, 1000);

		it("lat should be different", () => {
			// Assert
			expect(result.lat).not.toBe(lat);
		});

		it("lng should be different", () => {
			// Assert
			expect(result.lng).not.toBe(lng);
		});

		it("lat should be within 0.001", () => {
			// Assert
			const minus = result.lat - 0.01;
			const plus = result.lat + 0.01;
			const either = lat <= minus || lat <= plus;

			expect(either).toBeTrue();
		});

		it("lng should be within 0.001", () => {
			// Assert
			const minus = result.lat - 0.01;
			const plus = result.lat + 0.01;
			const either = lng <= minus || lng <= plus;

			expect(either).toBeTrue();
		});
	});
});
