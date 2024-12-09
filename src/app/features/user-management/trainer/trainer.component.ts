import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, first, Observable, switchMap } from 'rxjs';
import {
  Countries,
  Gender,
  Specialization,
  User,
} from '../../../core/models/cohort.interface';
import { InputFieldComponent } from '../../../core/shared/input-field/input-field.component';
import { TrainerService } from '@core/services/user-management/trainer/trainer.service';
import { MatIconModule } from '@angular/material/icon';
import { SvgService } from '@core/services/svg/svg.service';
import { CountryService } from '@core/services/user-management/country/country.service';
import { UserManagementTraineeService } from '@core/services/user-management/trainee/user-management-trainee.service';
import { FeedbackComponent } from '../../../core/shared/modal/feedback/feedback.component';
import { Router } from '@angular/router';
import { TraineeInsystemService } from '@core/services/user-management/trainee/trainee-insystem.service';

@Component({
  selector: 'app-trainer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputFieldComponent,
    MatIconModule,
    FeedbackComponent,
  ],
  templateUrl: './trainer.component.html',
  styleUrl: './trainer.component.scss',
})
export class TrainerComponent {
  trainerForm!: FormGroup;
  allSpecializations$!: Observable<Specialization[]>;
  allGenders: Gender[] = [{ sex: 'Male' }, { sex: 'Female' }, { sex: 'Other' }];
  selectedCountry!: string;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  countries: { name: string }[] = [];
  feedbackVisible: boolean = false;
  feedbackTitle: string = '';
  feedbackMessage: string = '';
  feedbackImageSrc: string = '';

  constructor(
    private fb: FormBuilder,
    public trainerService: TrainerService,
    private svgService: SvgService,
    private countryService: CountryService,
    private userManagementService: UserManagementTraineeService,
    private router: Router,
    private traineeInsystemService: TraineeInsystemService
  ) {}

  ngOnInit() {
    this.trainerForm = this.initTrainerForm();
    this.countryService.getCountries().subscribe((countries) => {
      this.countries = countries.map((country) => ({
        name: country.name.common,
      }));
    });
    this.allSpecializations$ =
      this.userManagementService.getAllspecializations();

    this.allSpecializations$.subscribe((specializations) => {
      console.log('Specializations', specializations);
    });
  }

  initTrainerForm() {
    return this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailAsyncValidator.bind(this)],
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: [this.allGenders[0].sex, Validators.required],
      country: [null, Validators.required],
      phoneNumber: ['', Validators.required],
      profilePhoto: [null],
      assignSpecialization: ['', Validators.required],
    });
  }

  showFeedback(title: string, message: string, imageSrc: string) {
    this.feedbackTitle = title;
    this.feedbackMessage = message;
    this.feedbackImageSrc = imageSrc;
    this.feedbackVisible = true;
  }

  onSubmit() {
    // if (this.trainerForm.invalid) {
    //   return;
    // }
    console.log('testing');

    const formData = new FormData();
    Object.keys(this.trainerForm.controls).forEach((key) => {
      const control = this.trainerForm.get(key);

      if (key === 'profilePhoto') {
        if (this.selectedFile) {
          formData.append(key, this.selectedFile, this.selectedFile.name);
        }
      } else if (key === 'assignSpecialization') {
        formData.append(key, Number(control?.value).toString());
      } else {
        formData.append(key, control?.value || '');
      }
    });

    formData.append('status', 'ACTIVE');

    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    this.trainerService.trainerCreation(formData).subscribe({
      next: () => {
        this.showFeedback(
          'User Created Successfully',
          'The user profile has been created successfully. The new account is now active and assigned the specified role',
          'assets/Images/svg/add-spec.svg'
        );
      },
      error: (error) => {
        console.error('Error creating trainer', error);
        this.showFeedback(
          'Error creating trainer',
          `${error.error}`,
          'assets/Images/svg/add-spec.svg'
        );
      },
    });
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name;
      this.selectedFile = file;
    }
  }

  onCloseFeedback() {
    this.feedbackVisible = false;
    this.router.navigate(['/home/admin/user-management']);
  }
}
