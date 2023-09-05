import { Subject, from, of, throwError } from "rxjs";
import { FetchService, TFromFetch, TInit } from "./FetchService";
import { CancellationToken } from "../models/CancellationToken";

describe("FetchService", () => {
	it("getJsonPromise", async () => {
		// Arrange
		type T = { test: number };

		const response = { test: 100 };

		const fetchDeps = {
			fromFetch: () => of(response),
			timer: () => of(1),
		};
		const fetchSvc = new FetchService(fetchDeps);

		// Act
		const result = await fetchSvc.getJsonPromise<T>(
			"http://api.open-notify.org/iss-now.json",
			{}
		);

		// Assert
		expect(result.test).toBe(100);
	});

	it("getJsonPromise catches error", async () => {
		// Arrange
		type T = { test: number };

		const response = Error("test error");

		const fetchDeps = {
			fromFetch: () => throwError(() => response),
			timer: () => of(1),
		};
		const fetchSvc = new FetchService(fetchDeps);

		// Act
		let error: unknown = undefined;
		try {
			await fetchSvc.getJsonPromise<T>(
				"http://api.open-notify.org/iss-now.json",
				{}
			);
		} catch (err: unknown) {
			error = err;
		}

		// Assert
		expect(error).toEqual("Caught: Error: test error");
	});

	it("getJson", (done) => {
		// Arrange
		type T = { test: number };

		const response = { test: 100 };

		const fetchDeps = {
			fromFetch: () => of(response),
			timer: () => of(1),
		};
		const fetchSvc = new FetchService(fetchDeps);

		// Act
		fetchSvc.getJson<T>("test", {}).subscribe((result) => {
			// Assert
			expect(result.test).toBe(100);
			done();
		});
	});

	it("getJson extracts Json", (done) => {
		// Arrange
		type T = { test: number };

		const response = { test: 100 };

		const fromFetch: TFromFetch = (_, init: TInit) => {
			const raw = {
				json: () => response,
			};

			const extracted = init.selector(raw);

			return of(extracted);
		};

		const fetchDeps = {
			fromFetch: fromFetch,
			timer: () => of(1),
		};
		const fetchSvc = new FetchService(fetchDeps);

		// Act
		fetchSvc.getJson<T>("test", {}).subscribe((result) => {
			// Assert
			expect(result.test).toBe(100);
			done();
		});
	});

	it("pollJson", (done) => {
		// Arrange
		let obsValue = 1;
		const response = () => {
			return obsValue++;
		};
		const obsLoop = from([of(1), of(2), of(3)]);

		const fetchDeps = {
			fromFetch: () => of(response()),
			timer: () => obsLoop,
		};
		const fetchSvc = new FetchService(fetchDeps);

		let output = 0;

		// Act
		fetchSvc.pollJson<number>(1, "bla", {}).subscribe({
			next: (value: number) => {
				output += value;
			},
			complete: () => {
				// Assert
				expect(output).toBe(6);
				done();
			},
		});
	});

	it("pollJson cancelled by token", () => {
		// Arrange
		let obsValue = 1;
		const response = () => {
			return obsValue++;
		};
		const subject = new Subject<number>();

		const fetchDeps = {
			fromFetch: () => of(response()),
			timer: () => subject,
		};
		const fetchSvc = new FetchService(fetchDeps);

		let output = 0;
		const cancellationToken = new CancellationToken();

		fetchSvc.pollJson<number>(1, "bla", {}, cancellationToken).subscribe({
			next: (value: number) => {
				output += value;
			},
		});

		// Act
		subject.next(1);
		subject.next(2);
		cancellationToken.cancel();
		subject.next(3);
		subject.complete();

		// Assert
		expect(output).toBe(3);
	});
});
