import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotHistoryCardComponent } from './spot-history-card.component';

describe('SpotHistoryCardComponent', () => {
	let component: SpotHistoryCardComponent;
	let fixture: ComponentFixture<SpotHistoryCardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SpotHistoryCardComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SpotHistoryCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
