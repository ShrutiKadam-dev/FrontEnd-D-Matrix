import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtfDetailsComponent } from './etf-details.component';

describe('EtfDetailsComponent', () => {
  let component: EtfDetailsComponent;
  let fixture: ComponentFixture<EtfDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtfDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtfDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
