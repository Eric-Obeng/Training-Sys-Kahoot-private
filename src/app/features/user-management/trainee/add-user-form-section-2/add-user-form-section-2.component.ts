import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cohort, Specialization, User } from '../../../../core/models/cohort.interface';
import { Observable, Subject, catchError, distinctUntilChanged, filter, first, map, of, switchMap, take, takeUntil, tap } from 'rxjs';
import { UserManagementTraineeService } from '../../../../core/services/user-management/trainee/user-management-trainee.service';
import { TraineeInsystemService } from '../../../../core/services/user-management/trainee/trainee-insystem.service';

@Component({
  selector: 'app-add-user-form-section-2',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, FormsModule, NgIf, AsyncPipe, JsonPipe],
  templateUrl: './add-user-form-section-2.component.html',
  styleUrl: './add-user-form-section-2.component.scss'
})
export class AddUserFormSection2Component {

  newUserFormSecTwo!: FormGroup;
  allSpecializations$!: Observable<Specialization[]>;
  allCohorts$!: Observable<Cohort[]>;

  traineeEnrollementDate: Date | undefined ;
  traineeStatus: string | undefined ;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public userManagementTraineeService: UserManagementTraineeService,
    public traineeInSystemService: TraineeInsystemService,
  ) {}

  ngOnInit() {
    this.traineeInSystemService.firstFormState$.subscribe(data => {
      console.log("first form data: ", data)
    })

    this.newUserFormSecTwo = this.fb.group({
      specialization: ['', Validators.required],
      cohort: ['', Validators.required],
      enrollementDate: ['',],
      status: ['',],
    })

    this.allSpecializations$ = this.userManagementTraineeService.getAllspecializations();
    this.allCohorts$ = this.userManagementTraineeService.getAllCohorts();  
    
     
    this.traineeInSystemService.retreivedUserData$.subscribe((data) => {
      if(data) {
        this.newUserFormSecTwo.patchValue({
          specialization: data.specialization,
          cohort: data.cohortId
        })
      }
    });

  }

  onSubmit() {
    const selectedCohortId = this.newUserFormSecTwo.get('cohort')?.value;
  
    this.allCohorts$
      .pipe(
        map((cohorts) => {
          const cohortId = cohorts.filter((cohort) => cohort.id == selectedCohortId)
          return cohortId;
        }), 
        take(1) 
      )
      .subscribe((filteredCohorts) => {
        if (filteredCohorts.length > 0) {
          this.traineeEnrollementDate = filteredCohorts[0].startDate;
          this.traineeStatus = filteredCohorts[0].status;
  
          // Patch the form value
          this.newUserFormSecTwo.patchValue({
            enrollementDate: this.traineeEnrollementDate,
            status: this.traineeStatus,
          });
  
          console.log(this.newUserFormSecTwo.value)
          // Submit the form after updating
          this.finalizeFormSubmission();
        } else {
          this.newUserFormSecTwo.markAllAsTouched();
        }
      });
  }
  
  finalizeFormSubmission() {
    if (!this.newUserFormSecTwo.invalid) {
      this.setSecondFormState();
      this.goToConfirmPage();
    } else {
      this.newUserFormSecTwo.markAllAsTouched();
    }
  }

  checkFormValidity() {
    if(this.newUserFormSecTwo.valid) {
      return false;
    }
    else{
      return true;
    }
  }
  
  setSecondFormState() {
    this.traineeInSystemService.setSecondFormState(this.newUserFormSecTwo.value)
  }

  goToConfirmPage() {
    this.router.navigate(['home/admin/user-management/confirm-contacts'])
  }
  
  goBack() {
    this.router.navigate(['/home/admin/user-management/add-user-form'])
  }


  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
