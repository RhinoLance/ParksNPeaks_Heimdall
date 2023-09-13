import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ModeBadgeComponent } from "./mode-badge.component";
import { SpotMode } from "../models/SpotMode";
import { By } from "@angular/platform-browser";

describe("ModeBadgeComponent", () => {
	let component: ModeBadgeComponent;
	let fixture: ComponentFixture<ModeBadgeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ModeBadgeComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ModeBadgeComponent);
		component = fixture.componentInstance;
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should change mode label when input chages", () => {
		// Arrange
		component.mode = SpotMode.CW;
		fixture.detectChanges();

		// Act
		component.mode = SpotMode.SSB;
		fixture.detectChanges();

		// Assert
		const modeElement = fixture.debugElement.query(By.css(".badge"));
		expect(modeElement.nativeElement.textContent).toContain("SSB");
	});
});
