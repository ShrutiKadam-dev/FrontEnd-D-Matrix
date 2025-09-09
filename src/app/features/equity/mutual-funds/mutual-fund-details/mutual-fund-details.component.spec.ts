import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualFundDetailsComponent } from './mutual-fund-details.component';

describe('SubMutualFundComponent', () => {
  let component: MutualFundDetailsComponent;
  let fixture: ComponentFixture<MutualFundDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MutualFundDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MutualFundDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
