import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviationCardComponent } from './deviation-card.component';

describe('DeviationCardComponent', () => {
  let component: DeviationCardComponent;
  let fixture: ComponentFixture<DeviationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
