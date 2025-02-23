import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoeCardComponent } from './coe-card.component';

describe('CoeCardComponent', () => {
  let component: CoeCardComponent;
  let fixture: ComponentFixture<CoeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
