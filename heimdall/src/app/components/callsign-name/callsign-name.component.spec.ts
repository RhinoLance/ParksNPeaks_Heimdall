import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CallsignNameComponent } from "./callsign-name.component";

describe("CallsignNameComponent", () => {
	let component: CallsignNameComponent;
	let fixture: ComponentFixture<CallsignNameComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [CallsignNameComponent],
		});
		fixture = TestBed.createComponent(CallsignNameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
