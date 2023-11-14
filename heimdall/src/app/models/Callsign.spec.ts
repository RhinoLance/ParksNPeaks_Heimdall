import { Subject } from "rxjs";
import { Callsign } from "./Callsign";

describe("Callsign", () => {
	describe("Extracts parts", () => {
		const tests = [
			{ callsign: "VK0AA", root: "VK0AA", prefix: "", suffix: "" },
			{ callsign: "VK0AA/P", root: "VK0AA", prefix: "", suffix: "P" },
			{ callsign: "VK3/VK0AA/P", root: "VK0AA", prefix: "VK3", suffix: "P" },
			{ callsign: "VK3/VK0A/P", root: "VK0A", prefix: "VK3", suffix: "P" },
			{ callsign: "VK3/VK0A", root: "VK0A", prefix: "VK3", suffix: "" },
		];

		tests.forEach((test) => {
			it(`Extracts ${test.callsign}`, () => {
				// Arrange
				const callsign = new Callsign(test.callsign);

				// Act
				const root = callsign.root;
				const prefix = callsign.prefix;
				const suffix = callsign.suffix;

				// Assert
				expect(root).toEqual(test.root);
				expect(prefix).toEqual(test.prefix);
				expect(suffix).toEqual(test.suffix);
			});
		});
	});

	it("Throws on invalid callsign", () => {
		// Arrange
		const callsign = "VK0AA/VK3/P";

		// Act
		const act = () => {
			return new Callsign(callsign);
		};

		// Assert
		expect(act).toThrow();
	});

	it("provicdes a toString() method", () => {
		// Arrange
		const callsign = new Callsign("VK3/VK0AA/P");

		// Act
		const result = callsign.toString();

		// Assert
		expect(result).toEqual("VK3/VK0AA/P");
	});
});
