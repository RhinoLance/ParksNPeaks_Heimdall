import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ModeBadgeComponent } from "./mode-badge.component";

describe("ModeBadgeComponent", () => {
	let component: ModeBadgeComponent;
	let fixture: ComponentFixture<ModeBadgeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ModeBadgeComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ModeBadgeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
