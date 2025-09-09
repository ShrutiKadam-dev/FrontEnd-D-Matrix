import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PMSDetailsComponent } from './pms-details.component';

describe('PMSDetailsComponent', () => {
  let component: PMSDetailsComponent;
  let fixture: ComponentFixture<PMSDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PMSDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PMSDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
