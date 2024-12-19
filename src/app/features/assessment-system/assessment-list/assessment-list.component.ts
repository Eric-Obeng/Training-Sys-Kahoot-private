import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
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
import { SearchbarService } from '../../../core/services/searchbar/searchbar.service';

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
  searchTerm: string = '';

  constructor(
    private router: Router,
    private assessmentService: AssessmentService,
    private searchbarService: SearchbarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchAssessmentTypes();
    this.fetchAssessments();
    this.searchbarService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.filterAssessments();
    });
  }

  fetchAssessmentTypes() {
    this.assessmentService.getAssessmentType().subscribe((data) => {
      this.assessmentTypes = data;
    });
  }

  fetchAssessments() {
    this.isLoading = true;
    this.assessments$ = this.assessmentService.getAssessments().pipe(
      tap((data) => {
        this.isAssessmentsEmpty = data.every(
          (assessment) =>
            assessment.quizzes.length === 0 &&
            assessment.labs.length === 0 &&
            assessment.presentations.length === 0
        );
        this.isLoading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      }),
      catchError((error) => {
        console.error('Error fetching assessments:', error);
        this.isLoading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
        return of([]);
      })
    );

    this.assessments$.subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (error) => {
        console.error('Error in subscription:', error);
        this.isLoading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
    });
  }

  filterAssessments() {
    this.assessments$ = this.assessmentService.getAssessments().pipe(
      map(assessments => assessments.map(assessment => ({
        ...assessment,
        quizzes: assessment.quizzes.filter(quiz =>
          quiz.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        ),
        labs: assessment.labs.filter(lab =>
          lab.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        ),
        presentations: assessment.presentations.filter(presentation =>
          presentation.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      })).filter(assessment =>
        assessment.quizzes.length > 0 ||
        assessment.labs.length > 0 ||
        assessment.presentations.length > 0
      )),
      tap((data) => {
        this.isAssessmentsEmpty = data.every(
          (assessment) =>
            assessment.quizzes.length === 0 &&
            assessment.labs.length === 0 &&
            assessment.presentations.length === 0
        );
        this.cdr.detectChanges(); // Manually trigger change detection
      }),
      catchError((error) => {
        console.error('Error fetching assessments:', error);
        this.isLoading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
        return of([]);
      })
    );
  }

  onSearchTermChange(term: string) {
    this.searchbarService.setSearchTerm(term);
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
