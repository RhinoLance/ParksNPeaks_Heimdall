import { PnPSpot } from "../models/PnPSpot";
import { PnPClientService } from "./PnPHttpClient.service";
import { FetchService } from "./FetchService";
import { Subject, of } from "rxjs";
import { Spot } from "../models/Spot";

describe("PnPHttpClientService", () => {
	/*
	let testScheduler: TestScheduler;
	
	beforeEach(() => {
		testScheduler = new TestScheduler((actual, expected) => {
			return expect(actual).toEqual(expected);
		});
	});
*/
	const templateSpot: PnPSpot = {
		actTime: "2023-07-04 00:28:00",
		actID: "2114006",
		actSiteID: "VK4/SE-114",
		actCallsign: "VK3WMD/P",
		actMode: "SSB",
		actFreq: "7.090",
		actClass: "SOTA",
		altClass: "VKFF",
		actLocation: "VK4/SE-114",
		altLocation: "VKFF-0344 Mount Coolum National Park",
		actComments: "Cq @1030 local time  *[iPnP] [VK3WMD]",
		actSpoter: "VK3WMD",
		WWFFid: "VKFF-0344",
	};

	const clonePnPSpot = (spot: PnPSpot): PnPSpot =>
		JSON.parse(JSON.stringify(spot));

	it("shouild get a spot list", async () => {
		// Arrange
		const fetch = new FetchService();
		spyOn(fetch, "getJsonPromise").and.returnValues(
			Promise.resolve([clonePnPSpot(templateSpot)])
		);

		const svc = new PnPClientService(fetch);

		// Act
		const result = await svc.getSpotList();

		// Assert
		expect(result.length).not.toBeNull();
	});

	describe("SubscribeToSpots", () => {
		it("should get a spot list", (done) => {
			// Arrange
			const pnpSpot = clonePnPSpot(templateSpot);

			const fetch = new FetchService();
			spyOn(fetch, "pollJson").and.returnValues(of([pnpSpot]));

			const svc = new PnPClientService(fetch);

			// Act
			svc.subscribeToSpots().subscribe((result) => {
				// Assert
				expect(result.length).not.toBeNull();
				done();
			});
		});

		it("should get two spot lists", () => {
			// Arrange
			const pnpSpot1 = clonePnPSpot(templateSpot);
			const pnpSpot2 = clonePnPSpot(templateSpot);
			const pnpSpot3 = clonePnPSpot(templateSpot);
			pnpSpot2.actMode = "CW";
			pnpSpot3.actMode = "FM";

			const subject = new Subject<PnPSpot[]>();

			const fetch = new FetchService();
			spyOn(fetch, "pollJson").and.returnValue(subject);

			const svc = new PnPClientService(fetch);
			const result: Spot[] = [];

			svc.subscribeToSpots().subscribe({
				next: (next) => {
					result.push(...next);
				},
			});

			// Act
			subject.next([pnpSpot1]);
			subject.next([pnpSpot2, pnpSpot3]);
			subject.complete();

			// Assert
			expect(result.length).toBe(3);
		});
	});

	/*
	it("subscribing should return one result", () => {
		// Arrange

		const fetch = new FetchService();

		const fetchValue = [clonePnPSpot(templateSpot)];

		spyOn(fetch, "getJsonPromise").and.returnValues(
			Promise.resolve(fetchValue),
			Promise.resolve(fetchValue)
		);

		const svc = new PnPClientService(fetch);

		const expectedValues = {
			a: "one",
			b: "two",
			c: "three",
		};

		const expectedMarbles = "-abc|";
		const subMarbles = "----!";

		//const sub = svc.subscribeToSpots(1/60/1000);
		const sub = svc.subscribeToSpots2();
		// Act
		testScheduler.run(({ expectObservable }) => {
			expectObservable(sub, subMarbles).toBe(expectedMarbles, expectedValues);
		});
	});


	it("subscribing should return two results", (done: DoneFn) => {
		
		// Arrange
		const pnp1 = clonePnPSpot(templateSpot);
		const pnp2 = clonePnPSpot(templateSpot);
		pnp2.actTime = new Date(pnp1.actTime).addMinutes(1).toISOString();

		const data = [[pnp1], [pnp2]];

		var fetch = new FetchService();
		const fetchSpy = spyOn(fetch, "getJson").and.returnValues(
			Promise.resolve(pnp1), 
			Promise.resolve(pnp2)
		);
		
		const svc = new PnPClientService(fetch);
		const resultSpots: Spot[] = [];
		let queryCount = 0;

		const cancellationToken = new CancellationToken();

		// Act
		const sub = svc.subscribeToSpots(0.001, cancellationToken)	.subscribe( {
			next: spotList => {
				queryCount++;
				if( queryCount == 5	){
					cancellationToken.cancel();
				}

				return resultSpots.push(...spotList);
			},
			error: err=>  {
				console.error("Whoops!: " + err);
				expect(err).toBeNull();
				done();
			},
			complete: () => {
				console.log(`Done with ${resultSpots.length}`);
				expect(resultSpots.length).toEqual(2);
				expect(true).toEqual(false);
				done();
			}
		});
		
	});
	*/
});
