import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentDiagramComponent } from './component-diagram.component';

describe('ComponentDiagramComponent', () => {
  let component: ComponentDiagramComponent;
  let fixture: ComponentFixture<ComponentDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentDiagramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
