import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SpotListComponent } from "./spot-list.component";
import { PnPClientService } from "src/app/services/PNPHttpClient.service";
import { Observable, Subject } from "rxjs";
import { Spot } from "src/app/models/Spot";

describe("SpotListComponent", () => {
	let component: SpotListComponent;
	let fixture: ComponentFixture<SpotListComponent>;
	const subScribeSubject = new Subject<Spot[]>();

	class MockPnpClientService {
		public getSpotList(): Promise<Spot[]> {
			return Promise.resolve([]);
		}

		public subscribeToSpots(): Observable<Spot[]> {
			return subScribeSubject;
		}
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SpotListComponent],
			providers: [
				SpotListComponent,
				{ provide: PnPClientService, useClass: MockPnpClientService },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SpotListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		subScribeSubject.complete();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	/*
	it("subscribed spot should add to list", () => {
	
		// Arrange
		
		// Act
		subScribeSubject.next([new Spot()]);
		fixture.detectChanges();
		
		// Assert
		expect(component.viewState.activationList.length).toBe(1);

	});

	it("should add activation to the html list", () => {
		
		// Arrange
		
		
		// Act
		component.viewState.activationList = [
			new Activation(new Spot())
		];

		fixture.detectChanges();
		const elementCount = fixture.debugElement.queryAll(
			By.css("pph-activation")).length;

		// Assert
		expect(elementCount).toBe(1);

	});
	
	it("subscribed spot should add to html list", () => {
	
		// Arrange
		
		// Act
		subScribeSubject.next([new Spot()]);
		fixture.detectChanges();
		
		const elementCount = fixture.debugElement.queryAll(
			By.css("pph-activation")).length;	
		
		// Assert
		expect(elementCount).toBe(1);
			
	
	});
	
	it("Two spots of different activations should add to html list", () => {
	
		// Arrange
		const spot1 = new Spot();
		spot1.callsign = "callsign1"
		

		const spot2 = new Spot();
		spot2.callsign = "callsign2";
		
		// Act
		subScribeSubject.next([spot1]);
		subScribeSubject.next([spot2]);
		fixture.detectChanges();

		const elementCount = fixture.debugElement.queryAll(
			By.css("pph-activation")).length;	
		
		// Assert
		expect(elementCount).toBe(2);
	
	});
	
	it("Two spots same activations should add to html list", () => {
	
		// Arrange
		const spot1 = new Spot();
		spot1.callsign = "callsign1"
		

		const spot2 = new Spot();
		spot2.callsign = "callsign1";
		
		// Act
		subScribeSubject.next([spot1]);
		subScribeSubject.next([spot2]);
		fixture.detectChanges();

		const elementCount = fixture.debugElement.queryAll(
			By.css("pph-activation")).length;	
		
		// Assert
		expect(elementCount).toBe(1);
	
	});
	
	*/
});
