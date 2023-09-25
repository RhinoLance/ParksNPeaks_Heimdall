import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ActivationComponent } from "./activation.component";
import { Spot } from "src/app/models/Spot";
import { Activation } from "src/app/models/Activation";
import { TimeagoModule } from "ngx-timeago";
import { importProvidersFrom } from "@angular/core";
import { SpotMode } from "src/app/models/SpotMode";
import { provideAnimations } from "@angular/platform-browser/animations";
import { RespotComponent } from "../respot/respot.component";

describe("ActivationComponent", () => {
	let component: ActivationComponent;
	let fixture: ComponentFixture<ActivationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ActivationComponent, RespotComponent],
			providers: [
				importProvidersFrom(TimeagoModule.forRoot()),
				provideAnimations(),
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ActivationComponent);
		component = fixture.componentInstance;
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should change mode label", () => {
		// Arrange
		const spot1 = new Spot();
		spot1.mode = SpotMode.SSB;
		spot1.frequency = 7.144;
		spot1.time = new Date("2021-01-01T12:00:00Z");

		const spot2 = new Spot();
		spot2.mode = SpotMode.CW;
		spot2.frequency = 7.032;
		spot2.time = new Date("2021-01-01T12:10:00Z");

		component.activation = new Activation(spot1);

		// Act
		component.activation.addSpot(spot2);
		fixture.detectChanges();

		// Assert
		const compiled = fixture.nativeElement;
		expect(compiled.querySelector(".mode").textContent).toContain("CW");
	});

	it("should change freq label", () => {
		// Arrange
		const spot1 = new Spot();
		spot1.mode = SpotMode.SSB;
		spot1.frequency = 7.144;
		spot1.time = new Date("2021-01-01T12:00:00Z");

		const spot2 = new Spot();
		spot2.mode = SpotMode.CW;
		spot2.frequency = 7.032;
		spot2.time = new Date("2021-01-01T12:10:00Z");

		component.activation = new Activation(spot1);

		// Act
		component.activation.addSpot(spot2);
		fixture.detectChanges();

		// Assert
		const compiled = fixture.nativeElement;
		expect(compiled.querySelector(".frequency").textContent).toContain("7.032");
	});

	it("should change comment label", () => {
		// Arrange
		const spot1 = new Spot();
		spot1.mode = SpotMode.SSB;
		spot1.frequency = 7.144;
		spot1.comment = "first";
		spot1.time = new Date("2021-01-01T12:00:00Z");

		const spot2 = new Spot();
		spot2.mode = SpotMode.CW;
		spot2.frequency = 7.032;
		spot2.comment = "second";
		spot2.time = new Date("2021-01-01T12:10:00Z");

		component.activation = new Activation(spot1);

		// Act
		component.activation.addSpot(spot2);
		fixture.detectChanges();

		// Assert
		const compiled = fixture.nativeElement;
		expect(compiled.querySelector(".comment").textContent).toContain("second");
	});
});
