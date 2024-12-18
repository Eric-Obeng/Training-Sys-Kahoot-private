import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, combineLatest, Subject } from 'rxjs';
import { takeUntil, catchError, finalize, tap } from 'rxjs/operators';
import { Specialization, Cohort } from '../../../../core/models/cohort.interface';
import { TraineeInsystemService } from '../../../../core/services/user-management/trainee/trainee-insystem.service';
import { UserManagementTraineeService } from '../../../../core/services/user-management/trainee/user-management-trainee.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { SnackbarService } from '@core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-confirm-training-details',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, AsyncPipe],
  templateUrl: './confirm-training-details.component.html',
  styleUrl: './confirm-training-details.component.scss'
})
export class ConfirmTrainingDetailsComponent implements OnDestroy {
  newUserFormSecTwo!: FormGroup;
  allSpecializations$!: Observable<Specialization[]>;
  allCohorts$!: Observable<Cohort[]>;

  isModalOpen = false;
  isUpdateModalOpen = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public userManagementTraineeService: UserManagementTraineeService,
    public traineeInSystemService: TraineeInsystemService,
    private snackBar: SnackbarService,
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadFormData();
    
  }

  private initForm() {
    this.newUserFormSecTwo = this.fb.group({
      specialization: [{value: '', disabled: true}, Validators.required],
      cohort: [{value: '', disabled: true}, Validators.required],
      enrollementDate: [{value: '', disabled: true}, Validators.required],
      status: ['']
    });
  }

  private loadFormData() {
    this.allSpecializations$ = this.userManagementTraineeService.getAllspecializations();
    this.allCohorts$ = this.userManagementTraineeService.getAllCohorts();
     
    this.traineeInSystemService.secondFormState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.newUserFormSecTwo.patchValue({
            specialization: data.specialization,
            cohort: data.cohort,
            enrollementDate: data.enrollementDate,
            status: data.status,
          }); 
        }
      });
  }

  submitUpdate() {
    combineLatest([
      this.traineeInSystemService.firstFormState$,
      this.traineeInSystemService.secondFormState$,
    ])
    .pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        this.errorMessage = 'Failed to retrieve form data. Please try again.';
        throw error;
      })
    )
    .subscribe(([firstFormState, secondFormState]) => {
      if (!firstFormState || !secondFormState) {
        this.errorMessage = 'Incomplete form data. Please fill all required fields.';
        return;
      }

      const newForm = {
        ...firstFormState, 
        ...secondFormState,
        cohortId: secondFormState.cohort,
      };

      delete (newForm as any).cohort;

      // Convert newForm to FormData
      const formData = this.convertToFormData(newForm);

      // Submit the FormData to the service
      this.traineeInSystemService.updateExistingUser(formData)
        .pipe(
          takeUntil(this.destroy$),
          tap((res) => {
            this.toggleUpdateModal();
          }),
          catchError(err => {
            this.errorMessage = 'Failed to create user. Please try again.';
            throw err;
          }),
        ).subscribe();
    });
  }

  submitCreateNewUSer() {
    combineLatest([
      this.traineeInSystemService.firstFormState$,
      this.traineeInSystemService.secondFormState$,
    ])
    .pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        this.errorMessage = 'Failed to retrieve form data. Please try again.';
        throw error;
      })
    )
    .subscribe(([firstFormState, secondFormState]) => {
      if (!firstFormState || !secondFormState) {
        this.errorMessage = 'Incomplete form data. Please fill all required fields.';
        return;
      }

      const newForm = {
        ...firstFormState, 
        ...secondFormState,
        cohortId: secondFormState.cohort,
      };

      delete (newForm as any).cohort;

      // Convert newForm to FormData
      const formData = this.convertToFormData(newForm);

      // Submit the FormData to the service
      this.traineeInSystemService.createNewUser(formData)
        .pipe(
          takeUntil(this.destroy$),
          tap((res) => {
            this.toggleModal();
          }),
          catchError(err => {
            this.snackBar.showError(err)
            this.errorMessage = 'Failed to create user. Please try again.';
            throw err;
          }),
        ).subscribe();
    });
  }

  private convertToFormData(newForm: any): FormData {
    const formData = new FormData();
    Object.keys(newForm).forEach((key) => {
      const value = newForm[key];
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancel() {
    this.router.navigate(['/home/admin/user-management/section-two']);
  }
  
  goBack() {
    this.router.navigate(['/home/admin/user-management/confirm-contacts']);
  }

  private capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  toggleUpdateModal() {
    this.isUpdateModalOpen = !this.isUpdateModalOpen;
  }

  routeToUserList() {
    this.router.navigate(['/home/admin/user-management']);
  }
}