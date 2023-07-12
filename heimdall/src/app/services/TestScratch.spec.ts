import { Observable, from, interval } from "rxjs";
import { map, mapTo, switchMap } from "rxjs/operators";
import { TestScheduler } from "rxjs/testing";
import { FetchService } from "./FetchService";
import { fakeAsync } from "@angular/core/testing";

describe("ScratchTest", () => {
	const svc = new FetchService();
	let testScheduler: TestScheduler;

	function getHttpResultEvery60Seconds(): Observable<any> {
		return interval(1) // Emit a value every 60 seconds
			.pipe(
				map(() => "hello") // Perform the HTTP GET request
			);
	}

	describe("getHttpResultEvery60Seconds", () => {
		beforeEach(() => {
			testScheduler = new TestScheduler((actual, expected) => {
				// Custom equality check for observables
				expect(actual).toEqual(expected);
			});
		});

		it("should emit an HTTP GET result every 50 miliseconds", fakeAsync(() => {
			testScheduler.run(({ expectObservable }) => {
				const expectedResponse = {
					a: "hello",
				};

				const svc = new FetchService();
				const unsub = "-------!";

				// Define the expected emissions
				const expectedEmissions = "-aaaaaa)";

				// Execute the function and expect the correct emissions
				expectObservable(getHttpResultEvery60Seconds(), unsub).toBe(
					expectedEmissions,
					expectedResponse
				);
			});
		}));
	});
});
