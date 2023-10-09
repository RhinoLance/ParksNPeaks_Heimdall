import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RespotComponent } from "./respot.component";
import { PnPClientService } from "src/app/services/PNPHttpClient.service";
import { Spot } from "src/app/models/Spot";
import { Observable, of, throwError } from "rxjs";
import { DataService } from "src/app/services/DataService";

describe("RespotComponent", () => {
	let component: RespotComponent;
	let fixture: ComponentFixture<RespotComponent>;

	class MockPnpClientService {
		public getSpotList(): Promise<Spot[]> {
			return Promise.resolve([]);
		}

		public subscribeToSpots(): Observable<Spot[]> {
			return of([]);
		}
	}

	const MockDataService = {
		submitSpot(spot: Spot): Observable<boolean> {
			expect(spot).toBeTruthy();
			return of(true);
		},
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RespotComponent],
			providers: [
				{ provide: PnPClientService, useClass: MockPnpClientService },
				{ provide: DataService, useValue: MockDataService },
			],
		});

		fixture = TestBed.createComponent(RespotComponent);
		component = fixture.componentInstance;
		component.spot = new Spot();
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	describe("should set the frequency", () => {
		const testCases = [
			{ testVal: 7.09, expected: 7.09 },
			{ testVal: 7090, expected: 7.09 },
			{ testVal: 1296.5, expected: 1296.5 },
			{ testVal: 1296500, expected: 1296.5 },
		];

		testCases.forEach((testCase) => {
			it(
				"should map from " + testCase.testVal + " to " + testCase.expected,
				() => {
					// Arrange
					const spot = new Spot();
					spot.frequency = 0;
					component.spot = spot;
					fixture.detectChanges();

					const input = document.createElement("input");
					input.value = testCase.testVal.toString();
					const event = { target: input } as unknown as Event;

					// Act
					component.setFrequency(event);

					// Assert
					expect(component.spot.frequency).toEqual(testCase.expected);
				}
			);
		});
	});

	describe("should send a respot", () => {
		it("should not send if already sending", () => {
			// Arrange
			component.viewState.isSending = true;
			spyOn(MockDataService, "submitSpot");

			// Act
			component.sendReSpot();

			// Assert
			expect(MockDataService.submitSpot).not.toHaveBeenCalled();
		});

		it("should send if not sending", () => {
			// Arrange
			component.viewState.isSending = false;
			spyOn(MockDataService, "submitSpot").and.returnValue(of(true));

			// Act
			component.sendReSpot();

			// Assert
			expect(MockDataService.submitSpot).toHaveBeenCalled();
		});

		it("should set isSending to false when done", () => {
			// Arrange
			component.viewState.isSending = false;
			spyOn(MockDataService, "submitSpot").and.returnValue(of(true));

			// Act
			component.sendReSpot();

			// Assert
			expect(component.viewState.isSending).toBe(false);
		});

		it("when an error, it should set viewState.sendError", () => {
			// Arrange
			component.viewState.sendError = false;
			spyOn(MockDataService, "submitSpot").and.returnValue(
				throwError(() => false)
			);

			// Act
			component.sendReSpot();

			// Assert
			expect(component.viewState.sendError).toBe(true);
		});
	});
});
