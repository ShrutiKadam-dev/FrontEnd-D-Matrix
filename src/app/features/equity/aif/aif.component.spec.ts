import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AifComponent } from './aif.component';

describe('AifComponent', () => {
  let component: AifComponent;
  let fixture: ComponentFixture<AifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
