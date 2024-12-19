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

  restCountries!: any;

  previewUrl: string | ArrayBuffer | null = null; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private traineeInsystemService: TraineeInsystemService,
    private usermanagementService: UserManagementTraineeService
  ) {}

  ngOnInit() {

    this.genders$ = this.usermanagementService.getAllGenders();
    this.countries$ = this.usermanagementService.getAllCountries();

    this.countries$.subscribe(data => this.restCountries = data)

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
        
        this.handleFile(data.userProfilePhoto);

      }
    })
  }

  private handleFile(file: File | null) {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result; // This sets the preview URL for the image
      };
      reader.readAsDataURL(file); // Generate a Data URL
    } else {
      this.previewUrl = null; // Clear the preview if there's no file
    }
  }

  checkFormValidity() {
    if(this.newUserFormConfirm.valid) {
      return false;
    }
    else{
      return true;
    }
  }

  setFirstFormData() {
    this.traineeInsystemService.setFirstFormState(this.newUserFormConfirm.value)
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
