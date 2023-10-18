import { Guid } from "./Guid";

describe("Guid", () => {
	beforeEach(() => {});

	describe("constructor", () => {
		const invalidStrings = ["", "this is not a valid guid string"];

		invalidStrings.forEach((badGuid) => {
			it(`invalid guid string: ${badGuid}`, () => {
				// Arrange
				const guidString = "this is not a valid guid string";
				let threwError = false;

				// Act
				try {
					new Guid(guidString);
				} catch (ex: unknown) {
					threwError = true;
				}

				// Assert
				expect(threwError).toBeTrue();
			});
		});
	});

	describe("equals", () => {
		it("Equals should be equal", () => {
			// Arrange
			const Guid1 = Guid.create();
			const Guid2 = new Guid(Guid1.toString());

			// Act
			const isEqual = Guid1.equals(Guid2.toString());

			// Assert
			expect(isEqual).toBeTrue();
		});

		it("It should not be equal", () => {
			// Arrange
			const Guid1 = Guid.create();
			const Guid2 = Guid.create();

			// Act
			const isEqual = Guid1.equals(Guid2.toString());

			// Assert
			expect(isEqual).toBeFalse();
		});
	});

	describe("isEmpty", () => {
		it("Equals should not be empty", () => {
			// Arrange
			const guid1 = new Guid("8fdcf981-298f-493d-85c0-e3a5d2eb9c2f");

			// Act
			const result = guid1.isEmpty();

			// Assert
			expect(result).toBeFalse();
		});

		it("It should be empty", () => {
			// Arrange
			const guid1 = new Guid("00000000-0000-0000-0000-000000000000");

			// Act
			const result = guid1.isEmpty();

			// Assert
			expect(result).toBeTrue();
		});
	});

	describe("toString", () => {
		it("Provides the guid as a string", () => {
			// Arrange
			const stringGuid = "8fdcf981-298f-493d-85c0-e3a5d2eb9c2f";
			const guid1 = new Guid(stringGuid);

			// Act
			const result = guid1.toString();

			// Assert
			expect(result).toEqual(stringGuid);
		});
	});

	describe("toJson", () => {
		it("Provides the guid as a string", () => {
			// Arrange
			const stringGuid = "8fdcf981-298f-493d-85c0-e3a5d2eb9c2f";
			const guid1 = new Guid(stringGuid);

			// Act
			const result = guid1.toJSON();

			// Assert
			expect(result).toEqual(stringGuid);
		});
	});

	describe("isGuid", () => {
		it("Guid should be a guid", () => {
			// Arrange
			const guid1 = new Guid("8fdcf981-298f-493d-85c0-e3a5d2eb9c2f");

			// Act
			const result = Guid.isGuid(guid1);

			// Assert
			expect(result).toBeTrue();
		});

		it("Guid string should be a guid", () => {
			// Arrange
			const stringGuid = "8fdcf981-298f-493d-85c0-e3a5d2eb9c2f";

			// Act
			const result = Guid.isGuid(stringGuid);

			// Assert
			expect(result).toBeTrue();
		});
	});

	describe("empty", () => {
		const empty = "00000000-0000-0000-0000-000000000000";
		const notEmpty = "8fdcf981-298f-493d-85c0-e3a5d2eb9c2f";

		it("Guid should be empty", () => {
			// Arrange
			//const guid1 = new Guid(empty);

			// Act
			const guid = Guid.Empty();
			const result = guid.toString();

			// Assert
			expect(result).toEqual(empty);
		});

		it("Guid should not be empty", () => {
			// Arrange
			//const guid1 = new Guid(empty);

			// Act
			const guid = new Guid(notEmpty);
			const result = guid.toString();

			// Assert
			expect(result).not.toEqual(empty);
		});
	});

	describe("raw", () => {
		it("Guid should be the correct format", () => {
			// Arrange
			const regex =
				/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/;

			// Act
			const raw = Guid.raw();
			const result = regex.test(raw);

			// Assert
			expect(result).toBeTrue();
		});
	});
});
