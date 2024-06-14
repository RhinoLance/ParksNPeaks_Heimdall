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
