import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CallsignNameComponent } from "./callsign-name.component";
import { CallsignDetails } from "src/app/models/CallsignDetails";
import { of } from "rxjs";
import { DataService } from "src/app/services/DataService";

describe("CallsignNameComponent", () => {
	let component: CallsignNameComponent;
	let fixture: ComponentFixture<CallsignNameComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [CallsignNameComponent],
		});
	});

	it("should create", () => {
		// Arrange
		const fixture = TestBed.createComponent(CallsignNameComponent);
		const component = fixture.componentInstance;
		fixture.detectChanges();

		// Act

		// Assert
		expect(component).toBeTruthy();
	});

	it("should show default if no matching callsign retrieved", () => {
		// Arrange
		const MockDataService = {
			getUserDetails: () => of(undefined),
		};

		TestBed.overrideComponent(CallsignNameComponent, {
			set: {
				providers: [{ provide: DataService, useValue: MockDataService }],
			},
		});

		const fixture = TestBed.createComponent(CallsignNameComponent);
		const component = fixture.componentInstance;
		fixture.detectChanges();

		// Act

		// Assert
		expect(component.viewState.callsignDetails.name).toBe("Unknown");
	});

	it("should show default if callsign with no name retrieved", () => {
		// Arrange
		const retCallsign = new CallsignDetails("VK0TEST", "", "", new Date());

		const MockDataService = {
			getUserDetails: () => of(retCallsign),
		};

		TestBed.overrideComponent(CallsignNameComponent, {
			set: {
				providers: [{ provide: DataService, useValue: MockDataService }],
			},
		});

		const fixture = TestBed.createComponent(CallsignNameComponent);
		const component = fixture.componentInstance;
		fixture.detectChanges();

		// Act

		// Assert
		expect(component.viewState.callsignDetails.name).toBe("Unknown");
	});

	it("should show name if callsign with name retrieved", () => {
		// Arrange
		const retCallsign = new CallsignDetails("VK0TEST", "Bobo", "", new Date());

		const MockDataService = {
			getUserDetails: () => of(retCallsign),
		};

		TestBed.overrideComponent(CallsignNameComponent, {
			set: {
				providers: [{ provide: DataService, useValue: MockDataService }],
			},
		});

		const fixture = TestBed.createComponent(CallsignNameComponent);
		const component = fixture.componentInstance;
		fixture.detectChanges();

		// Act

		// Assert
		expect(component.viewState.callsignDetails.name).toBe("Bobo");
	});
});
