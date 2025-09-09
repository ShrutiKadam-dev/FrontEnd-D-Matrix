import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectEquityDetailsComponent } from './direct-equity-details.component';

describe('DirectEquityDetailsComponent', () => {
  let component: DirectEquityDetailsComponent;
  let fixture: ComponentFixture<DirectEquityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectEquityDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectEquityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
