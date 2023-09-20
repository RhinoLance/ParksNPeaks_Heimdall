import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateSpotComponent } from "./create-spot.component";

describe("CreateSpotComponent", () => {
	let component: CreateSpotComponent;
	let fixture: ComponentFixture<CreateSpotComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [CreateSpotComponent],
		});
		fixture = TestBed.createComponent(CreateSpotComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
