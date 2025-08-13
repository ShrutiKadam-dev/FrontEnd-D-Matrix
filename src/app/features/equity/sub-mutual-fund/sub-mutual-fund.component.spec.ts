import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMutualFundComponent } from './sub-mutual-fund.component';

describe('SubMutualFundComponent', () => {
  let component: SubMutualFundComponent;
  let fixture: ComponentFixture<SubMutualFundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubMutualFundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubMutualFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
