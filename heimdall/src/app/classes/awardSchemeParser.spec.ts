import { AwardSchemeParser } from "./awardSchemeParser";
import { AwardScheme } from "../models/AwardScheme";

describe("AwardScmemeParser", () => {
	it("should return an empty array when an emnpty string is provided", () => {
		// Arrange
		const testString = "";

		// Act
		const result = new AwardSchemeParser(testString).parse();

		// Assert
		expect(result.length).toBe(0);
	});

	it("should return a single element", () => {
		// Arrange
		const testString = "I am also at a sota summit vk7/sw-1234";

		// Act
		const result = new AwardSchemeParser(testString).parse();

		// Assert
		expect(result.length).toBe(1);
	});

	it("should return the award scheme", () => {
		// Arrange
		const testString = "I am also at a sota summit vk7/sw-1234";

		// Act
		const result = new AwardSchemeParser(testString).parse();

		// Assert
		expect(result[0].award).toBe(AwardScheme.SOTA);
	});

	it("should return the site reference in uppercase", () => {
		// Arrange
		const testString = "I am also at a sota summit vk7/sw-1234";

		// Act
		const result = new AwardSchemeParser(testString).parse();

		// Assert
		expect(result[0].siteId).toBe("VK7/SW-1234");
	});
});

describe("AwardScmemeParser", () => {
	describe("Sota regex", () => {
		const testStringList = [
			{ string: "vk7/sw-1234", expected: true },
			{ string: "VK7/SW-1234", expected: true },
			{ string: "ZL7/SW-1234", expected: true },
			{ string: "zl7/SW-1234", expected: true },

			{ string: "VK7/S-1234", expected: true },
			{ string: "ZL7/SW-1234", expected: true },
			{ string: "VK7/SWE-1234", expected: true },

			{ string: "VK7/S-1", expected: true },
			{ string: "VK7/SWE-123", expected: true },
			{ string: "VK7/SWE-1234", expected: true },

			{ string: "AU/SW-1234", expected: false },
			{ string: "SW-1234", expected: false },
			{ string: "V/-1234 ", expected: false },
			{ string: "VK3/SWE1234 ", expected: false },

			{ string: "VK7/S/1234", expected: false },
			{ string: "VK7/S1234", expected: false },
			{ string: "V7/SW-abc ", expected: false },
			{ string: "VK/SWE ", expected: false },
		];

		testStringList.map((v) => {
			it(`${v.string}`, () => {
				// Arrange

				const parser = new AwardSchemeParser(v.string);

				// Act
				const result = parser.parse();

				// Assert
				if (v.expected) {
					expect(result[0].award).toBe(AwardScheme.SOTA);
				} else {
					expect(result.length).toBe(0);
				}
			});
		});
	});

	describe("VKFF regex", () => {
		const testStringList = [
			{ string: "VKFF-1234", expected: true },
			{ string: "vkff-1234", expected: true },

			{ string: "KFF-1234", expected: false },
			{ string: "VKFF-234", expected: false },
			{ string: "VKFF-a234", expected: false },
			{ string: "VKF1-1234", expected: false },
		];

		testStringList.map((v) => {
			it(`${v.string}`, () => {
				// Arrange

				const parser = new AwardSchemeParser(v.string);

				// Act
				const result = parser.parse();

				// Assert
				expect(result.length == 1).toBe(v.expected);
			});
		});
	});

	describe("ZLFF regex", () => {
		const testStringList = [
			{ string: "ZLFF-1234", expected: true },
			{ string: "zlff-1234", expected: true },

			{ string: "LFF-1234", expected: false },
			{ string: "ZLFF-234", expected: false },
			{ string: "ZLFF-a234", expected: false },
			{ string: "ZLF1-1234", expected: false },
		];

		testStringList.map((v) => {
			it(`${v.string}`, () => {
				// Arrange

				const parser = new AwardSchemeParser(v.string);

				// Act
				const result = parser.parse();

				// Assert
				expect(result.length == 1).toBe(v.expected);
			});
		});
	});

	describe("POTA regex", () => {
		const testStringList = [
			{ string: "AU-1234", expected: true },
			{ string: "au-1234", expected: true },

			{ string: "A-1234", expected: false },
			{ string: "AU-234", expected: false },
			{ string: "AU-a234", expected: false },
			{ string: "A1-1234", expected: false },
		];

		testStringList.map((v) => {
			it(`${v.string}`, () => {
				// Arrange

				const parser = new AwardSchemeParser(v.string);

				// Act
				const result = parser.parse();

				// Assert
				expect(result.length == 1).toBe(v.expected);
			});
		});
	});
});
