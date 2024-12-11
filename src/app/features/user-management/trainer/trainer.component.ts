import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  first,
  Observable,
  switchMap,
} from 'rxjs';
import { Countries, Gender, User } from '../../../core/models/cohort.interface';
import { Router } from '@angular/router';
import { TraineeInsystemService } from '../../../core/services/user-management/trainee/trainee-insystem.service';
import { InputFieldComponent } from "../../../core/shared/input-field/input-field.component";

@Component({
  selector: 'app-trainer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputFieldComponent],
  templateUrl: './trainer.component.html',
  styleUrl: './trainer.component.scss',
})
export class TrainerComponent {
  trainerForm!: FormGroup;

  genders$!: Observable<Gender[]>;
  countries$!: Observable<Countries[]>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public traineeInsystemService: TraineeInsystemService
  ) {}

  ngOnInit() {
    // this.genders$ = this.traineeInsystemService.getGenders();
    // this.countries$ = this.traineeInsystemService.getCountries();

    this.trainerForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailAsyncValidator.bind(this)],
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      universityCompleted: ['', Validators.required],
      userProfilePhoto: [''],
    });

    this.traineeInsystemService.retreivedUserData$.subscribe((data) => {
      const userdata = data;

      if (data) {
        console.log(userdata?.country);
        this.trainerForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          country: data.country,
          address: data.address,
          universityCompleted: data.universityCompleted,
          userProfilePhoto: data.userProfilePhoto,
        });
      }
    });
  }

  onSubmit() {
    // this.goToSecondSection();
    console.log('form data: ', this.trainerForm.value);
  }

  emailAsyncValidator(control: AbstractControl): Observable<User[] | null> {
    return control.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value) => {
        // Call the checkEmail method
        return this.traineeInsystemService.checkEmail(value).pipe(
          catchError(() => {
            return [];
          })
        );
      }),
      first()
    );
  }


  goBack() {
    window.history.back();
  }
}
