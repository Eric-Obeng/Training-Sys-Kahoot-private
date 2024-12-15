import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradedTraineesListComponent } from './graded-trainees-list.component';

describe('GradedTraineesListComponent', () => {
  let component: GradedTraineesListComponent;
  let fixture: ComponentFixture<GradedTraineesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradedTraineesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradedTraineesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
