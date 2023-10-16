import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ActivationPathMapComponent } from "./activation-path-map.component";
import { LatLng } from "src/app/models/LatLng";

describe("ActivationPathMapComponent", () => {
	let component: ActivationPathMapComponent;
	let fixture: ComponentFixture<ActivationPathMapComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ActivationPathMapComponent],
		});
		fixture = TestBed.createComponent(ActivationPathMapComponent);
		component = fixture.componentInstance;
		component.latLngStart = new LatLng(0, 0);
		component.latLngEnd = new LatLng(0, 0);
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
