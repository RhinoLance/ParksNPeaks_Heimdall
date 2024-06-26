import { PnPSpot } from "../models/PnPSpot";
import { FetchService, FetchServiceDeps } from "./FetchService";
import { Subject, from, of, throwError } from "rxjs";
import { Spot } from "../models/Spot";
import { PnPClientService } from "./PnPHttpClient.service";
import { SettingsKey, SettingsService } from "./SettingsService";
import { PnPPark } from "../models/PnPPark";

describe("PnPHttpClientService", () => {
	describe("Parks & Summits", () => {
		let settingsSvc: SettingsService;
		beforeEach(() => {
			settingsSvc = {
				getPnpUser: () => {
					return {
						apiKey: "1234567890",
						userName: "meuser",
						callsign: "VK0AA",
					};
				},
				settingUpdated: new Subject<SettingsKey>(),
			} as SettingsService;
		});

		it("shouild get a park", async () => {
			// Arrange
			const fetch = new FetchService(new FetchServiceDeps());
			spyOn(fetch, "getJsonPromise").and.returnValues(
				Promise.resolve(new PnPPark())
			);

			const svc = new PnPClientService(fetch, settingsSvc);

			// Act
			const result = await svc.getPark("WWFF", "VKFF-0344");

			// Assert
			expect(result).not.toBeNull();
		});

		it("shouild get a summit", async () => {
			// Arrange
			const fetch = new FetchService(new FetchServiceDeps());
			spyOn(fetch, "getJsonPromise").and.returnValues(
				Promise.resolve(new PnPPark())
			);

			const svc = new PnPClientService(fetch, settingsSvc);

			// Act
			const result = await svc.getSummit("VK7/SW-001");

			// Assert
			expect(result).not.toBeNull();
		});
	});

	describe("Spots", () => {
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

		let settingsSvc: SettingsService;

		beforeEach(() => {
			settingsSvc = {
				getPnpUser: () => {
					return {
						apiKey: "1234567890",
						userName: "meuser",
						callsign: "VK0AA",
					};
				},
				settingUpdated: new Subject<SettingsKey>(),
			} as SettingsService;
		});

		it("shouild get a spot list", async () => {
			// Arrange
			const fetch = new FetchService(new FetchServiceDeps());
			spyOn(fetch, "getJsonPromise").and.returnValues(
				Promise.resolve([clonePnPSpot(templateSpot)])
			);

			const svc = new PnPClientService(fetch, settingsSvc);

			// Act
			const result = await svc.getSpotList();

			// Assert
			expect(result.length).not.toBeNull();
		});

		describe("SubscribeToSpots", () => {
			it("should get a spot list", (done) => {
				// Arrange
				const pnpSpot = clonePnPSpot(templateSpot);

				const fetch = new FetchService(new FetchServiceDeps());
				spyOn(fetch, "pollJson").and.returnValues(of([pnpSpot]));

				const svc = new PnPClientService(fetch, settingsSvc);

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

				const fetch = new FetchService(new FetchServiceDeps());
				spyOn(fetch, "pollJson").and.returnValue(subject);

				const svc = new PnPClientService(fetch, settingsSvc);
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

			describe("manage network failures", () => {
				it("should resume on failure", () => {
					// Arrange

					const spot = clonePnPSpot(templateSpot);

					const obsLoop = from([of(1), of(2), of(3)]);

					const fetchDeps = {
						fromFetch: () => of([spot]),
						timer: () => obsLoop,
					};
					const fetch = new FetchService(fetchDeps);
					spyOn(fetchDeps, "fromFetch").and.returnValues(
						of([spot]),
						throwError(() => "Test Error!"),
						of([spot])
					);

					const svc = new PnPClientService(fetch, settingsSvc);
					const result: Spot[] = [];

					let hadError = false;

					// Act
					svc.subscribeToSpots().subscribe({
						error: (_) => {
							hadError = true;
						},
						next: (value) => {
							result.push(...value);
						},
					});

					// Assert
					expect(hadError).toBeFalse();
					expect(result.length).toBe(2);
				});
			});

			describe("Filter spots to region", () => {
				type CsTest = {
					callsign: string;
					valid: boolean;
				};

				const csTests: CsTest[] = [
					{ callsign: "VK7ZA", valid: true },
					{ callsign: "ZL7ZA", valid: true },
					{ callsign: "VL7ZA", valid: true },
					{ callsign: "VJ7ZA", valid: true },
					{ callsign: "VI10VKFF", valid: true },
					{ callsign: "7ZAVK", valid: false },
					{ callsign: "7ZAZL", valid: false },
					{ callsign: "7VKZA", valid: false },
					{ callsign: "7ZLZA", valid: false },
				];

				describe("getSpotList", () => {
					csTests.forEach((test: CsTest) => {
						it(`should filter ${test.callsign} to region`, async () => {
							// Arrange
							const pnpSpot1 = clonePnPSpot(templateSpot);
							pnpSpot1.actCallsign = test.callsign;

							const fetch = new FetchService(new FetchServiceDeps());
							spyOn(fetch, "getJsonPromise").and.returnValues(
								Promise.resolve([pnpSpot1])
							);

							const svc = new PnPClientService(fetch, settingsSvc);

							// Act
							const spotList = await svc.getSpotList();

							// Assert
							expect(spotList.length).toBe(test.valid ? 1 : 0);
						});
					});
				});

				describe("subscribeToSpots", () => {
					csTests.forEach((test: CsTest) => {
						it(`should filter ${test.callsign} to region`, async () => {
							// Arrange
							const pnpSpot1 = clonePnPSpot(templateSpot);
							pnpSpot1.actCallsign = test.callsign;

							const subject = new Subject<PnPSpot[]>();
							const fetch = new FetchService(new FetchServiceDeps());
							spyOn(fetch, "pollJson").and.returnValue(subject);

							const svc = new PnPClientService(fetch, settingsSvc);
							const result: Spot[] = [];

							svc.subscribeToSpots().subscribe({
								next: (next) => {
									result.push(...next);
								},
							});

							// Act
							subject.next([pnpSpot1]);
							subject.complete();

							// Assert
							expect(result.length).toBe(test.valid ? 1 : 0);
						});
					});
				});
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
});
