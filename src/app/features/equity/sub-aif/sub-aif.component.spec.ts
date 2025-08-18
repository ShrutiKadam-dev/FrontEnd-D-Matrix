import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAifComponent } from './sub-aif.component';

describe('SubAifComponent', () => {
  let component: SubAifComponent;
  let fixture: ComponentFixture<SubAifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubAifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubAifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
