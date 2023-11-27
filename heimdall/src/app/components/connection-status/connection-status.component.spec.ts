import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ConnectionStatusComponent } from "./connection-status.component";
import { RealTimeUserService } from "src/app/services/RealTimeUserService";
import { BehaviorSubject } from "rxjs";

describe("ConnectionStatusComponent", () => {
	let component: ConnectionStatusComponent;
	let fixture: ComponentFixture<ConnectionStatusComponent>;

	const rtsMock = {
		currentClientCount: new BehaviorSubject<number>(1),
		connectionStateChanged: new BehaviorSubject<boolean>(true),
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ConnectionStatusComponent],
			providers: [{ provide: RealTimeUserService, useValue: rtsMock }],
		});
		fixture = TestBed.createComponent(ConnectionStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
