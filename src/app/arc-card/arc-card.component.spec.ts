import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcCardComponent } from './arc-card.component';

describe('ArcCardComponent', () => {
  let component: ArcCardComponent;
  let fixture: ComponentFixture<ArcCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArcCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArcCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
