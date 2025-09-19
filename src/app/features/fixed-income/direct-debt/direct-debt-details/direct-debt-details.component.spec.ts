import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectDebtDetailsComponent } from './direct-debt-details.component';

describe('DirectDebtDetailsComponent', () => {
  let component: DirectDebtDetailsComponent;
  let fixture: ComponentFixture<DirectDebtDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectDebtDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectDebtDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
