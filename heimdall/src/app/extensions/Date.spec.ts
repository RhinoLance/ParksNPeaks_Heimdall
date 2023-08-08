describe("Date extensions", () => {
	it("should addMinutes", () => {
		// Arrange
		const date = new Date(2020, 1, 1, 12, 0, 0);

		// Act
		const result = date.addMinutes(10);

		// Assert
		expect(result.getMinutes()).toBe(10);
	});

	it("should subtract", () => {
		// Arrange
		const date1 = new Date(2020, 1, 1, 12, 0, 0);
		const date2 = new Date(2020, 1, 1, 12, 10, 0);

		// Act
		const result = date2.subtract(date1);

		// Assert
		expect(result).toBe(10 * 60 * 1000);
	});

	it("should subtractAbs", () => {
		// Arrange
		const date1 = new Date(2020, 1, 1, 12, 0, 0);
		const date2 = new Date(2020, 1, 1, 12, 10, 0);

		// Act
		const result = date1.subtractAbs(date2);

		// Assert
		expect(result).toBe(10 * 60 * 1000);
	});
});
