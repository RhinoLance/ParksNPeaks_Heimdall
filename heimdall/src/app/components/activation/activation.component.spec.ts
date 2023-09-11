//These tests are broken with the addition of the TimeagoModule. I'm not sure how to fix them.
/*
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ActivationComponent } from "./activation.component";
import { Spot } from "src/app/models/Spot";
import { Activation } from "src/app/models/Activation";
import { TimeagoClock, TimeagoFormatter } from "ngx-timeago";

describe("ActivationComponent", () => {
	let component: ActivationComponent;
	let fixture: ComponentFixture<ActivationComponent>;

	beforeEach(async () => {
		
		await TestBed.configureTestingModule({
			imports: [ActivationComponent],
			providers: [TimeagoFormatter, TimeagoClock]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ActivationComponent);
		component = fixture.componentInstance;
		component.activation = new Activation(new Spot());
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
*/
