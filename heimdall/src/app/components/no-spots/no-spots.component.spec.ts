import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NoSpotsComponent } from "./no-spots.component";

describe("NoSpotsComponent", () => {
	let component: NoSpotsComponent;
	let fixture: ComponentFixture<NoSpotsComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [NoSpotsComponent],
		});
		fixture = TestBed.createComponent(NoSpotsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
