import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  AssessmentData,
  CreateAssessment,
} from '@core/models/assessment-form.interface';
import { AssessmentService } from '@core/services/assessment/assessment.service';
import { ModalComponent } from '../components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../../../core/shared/searchbar/searchbar.component';
import { AssessmentCardComponent } from '../components/assessment-card/assessment-card.component';
import { LoaderComponent } from '../../../core/shared/loader/loader.component';

@Component({
  selector: 'app-assessment-list',
  standalone: true,
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss'],
  imports: [
    ModalComponent,
    CommonModule,
    SearchbarComponent,
    AssessmentCardComponent,
    LoaderComponent,
  ],
})
export class AssessmentListComponent {
  showModal = false;
  assessmentTypes: CreateAssessment[] = [];
  assessments$!: Observable<AssessmentData[]>;
  isAssessmentsEmpty = true;
  isLoading = true;

  constructor(
    private router: Router,
    private assessmentService: AssessmentService
  ) {}

  ngOnInit(): void {
    this.fetchAssessmentTypes();
    this.fetchAssessments();
  }

  fetchAssessmentTypes() {
    this.assessmentService.getAssessmentType().subscribe((data) => {
      this.assessmentTypes = data;
    });
  }

  fetchAssessments() {
    console.log('about to fetch');
    this.isLoading = true;
    this.assessments$ = this.assessmentService.getAssessments().pipe(
      tap((data) => {
        console.log('checking data', data);
        this.isAssessmentsEmpty = data.every(
          (assessment) =>
            assessment.quizzes.length === 0 &&
            assessment.labs.length === 0 &&
            assessment.presentations.length === 0
        );
      }),
      catchError((error) => {
        console.error('Error fetching assessments:', error);
        this.isLoading = false;
        return of([]);
      })
    );

    this.assessments$.subscribe({
      next: (data) => {
        console.log('Assessments fetched in component:', data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error in subscription:', error);
        this.isLoading = false;
      },
      complete: () => {
        console.log('Subscription completed');
        this.isLoading = false;
      }
    });
  }

  trackByType(index: number, item: CreateAssessment) {
    return item.type;
  }

  navigateToAssessmentForm(type: string) {
    if (type === 'quiz') {
      this.showModal = true;
    } else {
      this.router.navigate(['/home/trainer/assessment/create', type]);
    }
  }

  handleCloseModal() {
    this.showModal = false;
  }
}
