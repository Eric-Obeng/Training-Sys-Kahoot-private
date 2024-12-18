import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, debounceTime, distinctUntilChanged, switchMap, catchError, first } from 'rxjs';
import { Gender, Countries, User } from '../../../../core/models/cohort.interface';
import { TraineeInsystemService } from '../../../../core/services/user-management/trainee/trainee-insystem.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { UserManagementTraineeService } from '@core/services/user-management/trainee/user-management-trainee.service';

@Component({
  selector: 'app-confirm-contact-details',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, NgFor],
  templateUrl: './confirm-contact-details.component.html',
  styleUrl: './confirm-contact-details.component.scss'
})
export class ConfirmContactDetailsComponent {
  newUserFormConfirm!: FormGroup;
  genders$!: Observable<Gender[]>;
  countries$!: Observable<Countries[]>;
  disabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private traineeInsystemService: TraineeInsystemService,
    private usermanagementService: UserManagementTraineeService
  ) {}

  ngOnInit() {

    this.genders$ = this.usermanagementService.getAllGenders();
    this.countries$ = this.usermanagementService.getAllCountries();

    this.newUserFormConfirm = this.fb.group({
      email: [{value: '', disabled: true},Validators.required, Validators.email],
      firstName: [{value: '', disabled: true}, Validators.required],
      lastName: [{value: '', disabled: true}, Validators.required],
      dateOfBirth: [{value: '', disabled: true}, Validators.required],
      gender: [{value: '', disabled: true}, Validators.required],
      country: [{value: '', disabled: true}, Validators.required],
      address: [{value: '', disabled: true}, Validators.required],
      phoneNumber: [{value: '', disabled: true}, Validators.required],
      universityCompleted: [{value: '', disabled: true}, Validators.required],
      userProfilePhoto: ['']
    })

    this.traineeInsystemService.firstFormState$.subscribe(data => {     
      if(data) {
        this.newUserFormConfirm.patchValue({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          country: data.country,
          address: data.address,
          phoneNumber: data.phoneNumber,
          universityCompleted: data.universityCompleted,
          userProfilePhoto: data.userProfilePhoto,
        });
      }
    })
  }

  setFirstFormData() {
    this.traineeInsystemService.setFirstFormState(this.newUserFormConfirm.value)
  }


  emailAsyncValidator(control: AbstractControl): Observable<User[] | null> {
    return control.valueChanges.pipe(
      debounceTime(500), 
      distinctUntilChanged(),
      switchMap(value => {
        return this.traineeInsystemService.checkEmail(value).pipe(
          catchError(() => {
            return []; 
          })
        );
      }),
      first()
    );
  }


  next() {
    this.router.navigate(['home/admin/user-management/confirm-training'])
  }

  cancel() {
    this.router.navigate(['/home/admin/user-management'])
  }


  goBack() {
    this.router.navigate(['/home/admin/user-management/section-two'])
  }
}
