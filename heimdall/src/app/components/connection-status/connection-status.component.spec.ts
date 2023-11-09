import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ConnectionStatusComponent } from "./connection-status.component";

describe("ConnectionStatusComponent", () => {
	let component: ConnectionStatusComponent;
	let fixture: ComponentFixture<ConnectionStatusComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ConnectionStatusComponent],
		});
		fixture = TestBed.createComponent(ConnectionStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
