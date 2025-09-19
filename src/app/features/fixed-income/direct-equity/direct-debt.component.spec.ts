import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectEquityComponent } from './direct-debt.component';

describe('DirectEquityComponent', () => {
  let component: DirectEquityComponent;
  let fixture: ComponentFixture<DirectEquityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectEquityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectEquityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
