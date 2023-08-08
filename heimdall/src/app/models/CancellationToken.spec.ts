import { Subject } from "rxjs";
import { CancellationToken } from "./CancellationToken";

describe("Cancellation Token", () => {
	it("Creates as uncancelled", () => {
		// Arrange
		const token = new CancellationToken();

		// Act
		const result = token.isCancelled;

		// Assert
		expect(result).toEqual(false);
	});

	it("Creates as uncancelled", () => {
		// Arrange
		const token = new CancellationToken();

		// Act
		token.cancel();
		const result = token.isCancelled;

		// Assert
		expect(result).toEqual(true);
	});

	it("Gets the token subject", () => {
		// Arrange
		const token = new CancellationToken();

		// Act
		const subject = token.token;

		// Assert
		expect(subject).toBeInstanceOf(Subject<boolean>);
	});
});
