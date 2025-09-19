import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectDebtComponent } from './direct-debt.component';

describe('DirectDebtComponent', () => {
  let component: DirectDebtComponent;
  let fixture: ComponentFixture<DirectDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectDebtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
