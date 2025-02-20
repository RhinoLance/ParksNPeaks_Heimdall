import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotFilterComponent } from './spot-filter.component';

describe('SpotFilterComponent', () => {
  let component: SpotFilterComponent;
  let fixture: ComponentFixture<SpotFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpotFilterComponent]
    });
    fixture = TestBed.createComponent(SpotFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
