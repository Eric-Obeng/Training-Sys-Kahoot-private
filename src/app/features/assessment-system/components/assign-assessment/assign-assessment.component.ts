import {
  Component,
  model,
  Output,
  EventEmitter,
  OnInit,
  Input,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TraineeListComponent } from '../trainee-list/trainee-list.component';
import { CohortListComponent } from '../cohort-list/cohort-list.component';
import { DropdownModule } from 'primeng/dropdown';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { TraineeInsystemService } from '@core/services/user-management/trainee/trainee-insystem.service';
import { CohortDetails, User } from '@core/models/cohort.interface';
import { UserManagementTraineeService } from '@core/services/user-management/trainee/user-management-trainee.service';
import { initializeDropdownOptions } from '../../../../utils/kahootDropDownData';
import { AssessmentService } from '@core/services/assessment/assessment.service';
import { AssignAssessment } from '@core/models/assessment-form.interface';
import { FeedbackComponent } from '../../../../core/shared/modal/feedback/feedback.component';
import { Router } from '@angular/router';

interface FilterOptions {
  specialization: string[];
  cohort: string[];
}

@Component({
  selector: 'app-assign-assessment',
  standalone: true,
  imports: [
    MatTabsModule,
    TraineeListComponent,
    CohortListComponent,
    DropdownModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    CommonModule,
    TabViewModule,
    ReactiveFormsModule,
    FeedbackComponent,
  ],
  templateUrl: './assign-assessment.component.html',
  styleUrl: './assign-assessment.component.scss',
})
export class AssignAssessmentComponent implements OnInit {
  selectedExpiry: { name: string }[] | undefined;
  @Input() currentAssessmentId: number | undefined;
  @Output() cancel = new EventEmitter<void>();

  size: any = null;

  assignAssessmentForm!: FormGroup;

  feedbackVisible: boolean = false;
  feedbackTitle: string = '';
  feedbackMessage: string = '';
  feedbackImageSrc: string = '';

  showFeedback(title: string, message: string, imageSrc: string) {
    this.feedbackTitle = title;
    this.feedbackMessage = message;
    this.feedbackImageSrc = imageSrc;
    this.feedbackVisible = true;
  }

  constructor(
    private traineeInsystem: TraineeInsystemService,
    private userManagementTraineeService: UserManagementTraineeService,
    private fb: FormBuilder,
    private assessmentService: AssessmentService,
    private router: Router
  ) {}
  activeCohort: CohortDetails[] = [];
  trainees: User[] = [];
  filteredTrainees: User[] = [];
  traineeEmail: string[] = [];

  filterOptions: FilterOptions = {
    specialization: [],
    cohort: [],
  };

  initializeExpiresIn() {
    const dropdownOptions = initializeDropdownOptions();
    this.selectedExpiry = dropdownOptions.expiryOptions;
  }

  ngOnInit(): void {
    this.initializeExpiresIn();
    this.initAssignAssessmentForm();

    this.traineeInsystem.getAllTrainees().subscribe({
      next: (trainees: User[]) => {
        this.trainees = trainees;
        this.filteredTrainees = trainees;
      },
      error: (error) => console.error('Error fetching trainees:', error),
    });

    this.userManagementTraineeService.getAllspecializations().subscribe({
      next: (specializations) => {
        this.filterOptions.specialization = [
          'All',
          ...specializations.map((s) => s.name),
        ];
      },
      error: (error) => console.error('Error fetching specializations:', error),
    });

    this.userManagementTraineeService.getAllActiveCohorts().subscribe({
      next: (cohorts) => {
        this.filterOptions.cohort = ['All', ...cohorts.map((c) => c.name)];
      },
      error: (error) => console.error('Error fetching cohorts:', error),
    });

    this.userManagementTraineeService.getAllActiveCohorts().subscribe({
      next: (cohort: CohortDetails[]) => {
        this.activeCohort = cohort;
      },
    });
  }

  initAssignAssessmentForm() {
    this.assignAssessmentForm = this.fb.group({
      deadline: [null, [Validators.required]],
    });
  }

  selectedSpecialization = '';
  selectedCohort = '';
  hasSelectedItems = false;

  readonly checked = model(false);
  selectAllChecked = false;
  selectedCohortIds: number[] = [];

  onCancel() {
    this.cancel.emit();
  }

  onTraineeSelectionChange(emails: string[]) {
    this.traineeEmail = emails;
  }

  onCohortSelectionChange(cohortIds: number[]) {
    this.selectedCohortIds = cohortIds;
  }

  onAssign() {
    const { deadline } = this.assignAssessmentForm.value;
    const formattedDeadline = formatDate(
      deadline,
      'yyyy-MM-ddTHH:mm:ss',
      'en-US'
    );

    if (this.selectedCohortIds.length > 0) {
      this.selectedCohortIds.forEach((cohortId) => {
        this.assessmentService
          .assignAssessmentToCohort(
            this.currentAssessmentId ?? 0,
            cohortId,
            formattedDeadline
          )
          .subscribe({
            next: () => {
              this.showFeedback(
                `Assigned Successfully`,
                `Your quiz has been successfully assigned to the selected cohorts. They can now access and complete it within the given time-frame`,
                'assets/Images/svg/add-spec.svg'
              );
            },
            error: (error) => {
              console.error('Error assigning assessment to cohort:', error),
                this.showFeedback(
                  `Failed to Assign Assessment`,
                  `${error.error.message}`,
                  'assets/Images/svg/add-spec.svg'
                );
            },
          });
      });
    }

    if (this.traineeEmail.length > 0) {
      const assessmentData: AssignAssessment = {
        assessmentId: this.currentAssessmentId ?? 0,
        deadline: formattedDeadline,
        traineeEmail: this.traineeEmail,
      };

      this.assessmentService.assignAssessment(assessmentData).subscribe({
        next: () => {
          this.showFeedback(
            `Assigned Successfully`,
            `Your quiz has been successfully assigned to the selected trainees. They can now access and complete it within the given time-frame`,
            'assets/Images/svg/add-spec.svg'
          );
        },
        error: (error) => {
          console.error('Error assigning assessment:', error),
            this.showFeedback(
              `Failed to Assign Assessment`,
              `${error.error.message}`,
              'assets/Images/svg/add-spec.svg'
            );
        },
      });
    }
  }

  applyFilters() {
    this.filteredTrainees = this.trainees.filter((trainee) => {
      const matchesSpecialization =
        this.selectedSpecialization === 'All' || !this.selectedSpecialization
          ? true
          : trainee.specialization === this.selectedSpecialization;
      const matchesCohort =
        this.selectedCohort === 'All' || !this.selectedCohort
          ? true
          : trainee.cohort === this.selectedCohort;
      return matchesSpecialization && matchesCohort;
    });
  }

  onSelectAll(event: any) {
    this.selectAllChecked = event.checked;
    this.filteredTrainees.forEach((trainee) => {
      const checkbox = document.querySelector(
        `input[type="checkbox"][value="${trainee.email}"]`
      );
      if (checkbox) {
        (checkbox as HTMLInputElement).checked = this.selectAllChecked;
      }
    });
    this.onTraineeSelectionChange(
      this.selectAllChecked
        ? this.filteredTrainees.map((trainee) => trainee.email)
        : []
    );
  }

  onCloseFeedback() {
    this.feedbackVisible = false;
    this.onCancel();
    this.router.navigate(['/home/trainer/assessment']);
  }
}
