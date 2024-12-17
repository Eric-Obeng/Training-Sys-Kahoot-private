import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AssessmentListComponent } from './assessment-list.component';

describe('AssessmentListComponent', () => {
  let component: AssessmentListComponent;
  let fixture: ComponentFixture<AssessmentListComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentListComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the correct route when navigateToAssessmentForm is called', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const type = 'quiz';
    component.navigateToAssessmentForm(type);
    expect(navigateSpy).toHaveBeenCalledWith(['/home/trainer/assessment/create', type]);
  });
});
