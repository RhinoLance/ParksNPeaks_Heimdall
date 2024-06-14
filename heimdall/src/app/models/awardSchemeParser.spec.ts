import { regexPota, regexSota, regexVkff, regexZlff } from "./AwardScheme";

describe("AwardScmemeParser", () => {
	describe("Sota regex", () => {
		
		const testStringList = [
			{string: "vk7/sw-1234", expected: true},
			{string: "VK7/SW-1234", expected: true},
			{string: "ZL7/SW-1234", expected: true},
			{string: "zl7/SW-1234", expected: true},

			{string: "VK7/S-1234", expected: true},
			{string: "ZL7/SW-1234", expected: true},
			{string: "VK7/SWE-1234", expected: true},

			{string: "VK7/S-1", expected: true},
			{string: "VK7/SWE-123", expected: true},
			{string: "VK7/SWE-1234", expected: true},

			{string: "AU/SW-1234", expected: false},
			{string: "SW-1234", expected: false},
			{string: "V/-1234 ", expected: false},
			{string: "VK3/SWE1234 ", expected: false},

			{string: "VK7/S/1234", expected: false},
			{string: "VK7/S1234", expected: false},
			{string: "V7/SW-abc ", expected: false},
			{string: "VK/SWE ", expected: false},
		];

		testStringList.map( v => {

			it(`${v.string}`, () => {
				// Arrange
				
				// Act
				const result = regexSota.test(v.string);

				// Assert
				expect(result).toBe(v.expected);
			});

		});
	});

	describe("VKFF regex", () => {
		
		const testStringList = [
			{string: "VKFF-1234", expected: true},
			{string: "vkff-1234", expected: true},
			
			{string: "KFF-1234", expected: false},
			{string: "VKFF-234", expected: false},
			{string: "VKFF-a234", expected: false},
			{string: "VKF1-1234", expected: false},
		];

		testStringList.map( v => {

			it(`${v.string}`, () => {
				// Arrange
				
				// Act
				const result = regexVkff.test(v.string);

				// Assert
				expect(result).toBe(v.expected);
			});

		});
	});

	describe("ZLFF regex", () => {
		
		const testStringList = [
			{string: "ZLFF-1234", expected: true},
			{string: "zlff-1234", expected: true},
			
			{string: "LFF-1234", expected: false},
			{string: "ZLFF-234", expected: false},
			{string: "ZLFF-a234", expected: false},
			{string: "ZLF1-1234", expected: false},
		];

		testStringList.map( v => {

			it(`${v.string}`, () => {
				// Arrange
				
				// Act
				const result = regexZlff.test(v.string);

				// Assert
				expect(result).toBe(v.expected);
			});

		});
	});

	describe("POTA regex", () => {
		
		const testStringList = [
			{string: "AU-1234", expected: true},
			{string: "au-1234", expected: true},
			
			{string: "A-1234", expected: false},
			{string: "AU-234", expected: false},
			{string: "AU-a234", expected: false},
			{string: "A1-1234", expected: false},
		];

		testStringList.map( v => {

			it(`${v.string}`, () => {
				// Arrange
				
				// Act
				const result = regexPota.test(v.string);

				// Assert
				expect(result).toBe(v.expected);
			});

		});
	});


});