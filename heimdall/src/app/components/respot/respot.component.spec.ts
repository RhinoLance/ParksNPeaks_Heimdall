import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RespotComponent } from "./respot.component";

describe("RespotComponent", () => {
	let component: RespotComponent;
	let fixture: ComponentFixture<RespotComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [RespotComponent],
		});
		fixture = TestBed.createComponent(RespotComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
