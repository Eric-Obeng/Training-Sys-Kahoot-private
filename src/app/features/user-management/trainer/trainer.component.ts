import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  map,
  Observable,
  switchMap,
} from 'rxjs';
import {
  Countries,
  Gender,
  Specialization,
  User,
} from '../../../core/models/cohort.interface';
import { Trainer } from '../../../core/models/trainer.interface';
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
  styleUrls: ['./trainer.component.scss'],
})
export class TrainerComponent {
  trainerForm!: FormGroup;
  allSpecializations$!: Observable<Specialization[]>;
  allGenders: Gender[] = [{ sex: 'Male' }, { sex: 'Female' }];
  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  restCountries!: Countries[];
  feedbackVisible: boolean = false;
  feedbackTitle: string = '';
  feedbackMessage: string = '';
  feedbackImageSrc: string = '';
  feedbackType: 'success' | 'error' = 'success';
  trainerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    public trainerService: TrainerService,
    private svgService: SvgService,
    private userManagementService: UserManagementTraineeService,
    private router: Router,
    private traineeInsystemService: TraineeInsystemService,
    private countryService: CountryService
  ) {}

  ngOnInit() {
    this.trainerForm = this.initTrainerForm();
    this.loadCountries();
    this.loadSpecializations();

    this.trainerService.selectedTrainer$.subscribe((trainer) => {
      if (trainer) {
        this.trainerId = trainer.id;
        this.populateForm(trainer);
      }
    });
  }

  private loadCountries(): void {
    this.countryService
      .getCountries()
      .pipe(
        catchError((error) => {
          console.error('Error fetching countries:', error);
          this.showFeedback(
            'Error',
            'Failed to fetch countries.',
            'error-image-path',
            'error'
          );
          return [];
        })
      )
      .subscribe((data) => {
        this.restCountries = data;
      });
  }

  private loadSpecializations(): void {
    this.allSpecializations$ = this.userManagementService
      .getAllspecializations()
      .pipe(
        catchError((error) => {
          console.error('Error fetching specializations:', error);
          this.showFeedback(
            'Error',
            'Failed to fetch specializations.',
            'error-image-path',
            'error'
          );
          return [];
        })
      );
  }

  private populateForm(trainer: Trainer): void {
    this.trainerForm.patchValue({
      email: trainer.email,
      firstName: trainer.firstName,
      lastName: trainer.lastName,
      gender: trainer.gender,
      country: trainer.country,
      phoneNumber: trainer.phoneNumber,
      assignSpecialization: trainer.assignSpecialization,
    });

    if (trainer.profilePhoto) {
      this.selectedFileName = trainer.profilePhoto.name;
      this.selectedFile = trainer.profilePhoto;
    }
  }

  private initTrainerForm(): FormGroup {
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
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      profilePhoto: [null],
      assignSpecialization: ['', Validators.required],
    });
  }

  showFeedback(
    title: string,
    message: string,
    imageSrc: string,
    type: 'success' | 'error'
  ): void {
    this.feedbackTitle = title;
    this.feedbackMessage = message;
    this.feedbackImageSrc = imageSrc;
    this.feedbackType = type;
    this.feedbackVisible = true;
  }

  onSubmit(): void {
    if (this.trainerForm.invalid) {
      return;
    }

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

    if (this.trainerId) {
      this.trainerService.updateTrainer(this.trainerId, formData).subscribe({
        next: () => {
          this.showFeedback(
            'User Updated Successfully',
            'The user profile has been updated successfully.',
            'assets/Images/svg/add-spec.svg',
            'success'
          );
        },
        error: (error) => {
          console.error('Error updating trainer:', error);
          this.showFeedback(
            'Error Updating Trainer',
            `${error.message}`,
            'assets/Images/svg/add-spec.svg',
            'error'
          );
        },
      });
    } else {
      this.trainerService.trainerCreation(formData).subscribe({
        next: () => {
          this.showFeedback(
            'User Created Successfully',
            'The user profile has been created successfully. The new account is now active and assigned the specified role.',
            'assets/Images/svg/add-spec.svg',
            'success'
          );
        },
        error: (error) => {
          console.error('Error creating trainer:', error);
          this.showFeedback(
            'Error Creating Trainer',
            `${error.message}`,
            'assets/Images/svg/add-spec.svg',
            'error'
          );
        },
      });
    }
  }

  emailAsyncValidator(control: AbstractControl): Observable<User | null> {
    return control.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value) => {
        return this.traineeInsystemService.checkEmail(value).pipe(
          catchError(() => []),
          first()
        );
      })
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(file.type)) {
        return;
      }

      if (file.size > maxSize) {
        return;
      }

      this.selectedFileName = file.name;
      this.selectedFile = file;
    }
  }

  onCloseFeedback(): void {
    this.feedbackVisible = false;
    this.router.navigate(['/home/admin/user-management']);
  }

  goBack(): void {
    window.history.back();
    this.trainerForm.reset();
    this.trainerService.setSelectedTrainer(null);
  }
}
