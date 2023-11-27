import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AnalyticsComponent } from "./analytics.component";
import { BehaviorSubject, Subject } from "rxjs";
import { RealTimeUserService } from "src/app/services/RealTimeUserService";
import { HubUser } from "src/app/services/HeimdallSignalRService";

describe("AnalyticsComponent", () => {
	let component: AnalyticsComponent;
	let fixture: ComponentFixture<AnalyticsComponent>;

	const rtsMock = {
		currentClientCount: new BehaviorSubject<number>(1),
		connectionStateChanged: new BehaviorSubject<boolean>(true),
		connectionAdded: new Subject<HubUser>(),
		connectionRemoved: new Subject<HubUser>(),
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AnalyticsComponent],
			providers: [{ provide: RealTimeUserService, useValue: rtsMock }],
		});
		fixture = TestBed.createComponent(AnalyticsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
