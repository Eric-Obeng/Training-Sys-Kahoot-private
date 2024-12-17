import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { InputFieldComponent } from '../../../../core/shared/input-field/input-field.component';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, combineLatest, debounceTime, distinctUntilChanged, filter, first, map, of, switchMap, takeUntil, tap, } from 'rxjs';
import { Countries, Gender, Specialization, User } from '../../../../core/models/cohort.interface';
import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { TraineeInsystemService } from '../../../../core/services/user-management/trainee/trainee-insystem.service';
import { UserManagementTraineeService } from '@core/services/user-management/trainee/user-management-trainee.service';
import { specialization } from '@core/models/specialization.interface';

@Component({
  selector: 'app-add-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, AsyncPipe, NgFor, NgIf, TitleCasePipe],
  templateUrl: './add-user-form.component.html',
  styleUrl: './add-user-form.component.scss',
})
export class AddUserFormComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  newUserForm!: FormGroup;
  genders$!: Observable<Gender[]>;
  countries$!: Observable<Countries[]>;

  restCountries!: any;


  //Image upload
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  maxDate!: string;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public traineeInsystemService: TraineeInsystemService,
    public usermanagementService: UserManagementTraineeService
  ) {}

  ngOnInit() {
    this.initializeFormData();
    this.createForm();
    this.setupEmailSubscriptions();
    this.setupFormStateSubscriptions();
    // this.displayRetrievedImage();
  }

  private initializeFormData() {
    this.setMaxDateOfBirth();

    // Initialize observables
    this.genders$ = this.usermanagementService.getAllGenders();
    this.countries$ = this.usermanagementService.getAllCountries();

    this.countries$.subscribe(data => this.restCountries = data)

  }

  private createForm() {
    this.newUserForm = this.fb.group({
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
      phoneNumber: ['', Validators.required],
      universityCompleted: ['', Validators.required],
      userProfilePhoto: ['']
    });


  }

  private setupEmailSubscriptions() {
    // Populate email from selected email subject
    this.traineeInsystemService.selectedEmail$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (email) => {
          if (email) {
            this.newUserForm.patchValue({ email });
          }
        }
      });
  }

  private setupFormStateSubscriptions() {
    // Prioritize firstFormState, fallback to retrievedUserData
    this.traineeInsystemService.firstFormState$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(firstFormState =>
          firstFormState
            ? of(firstFormState)
            : this.traineeInsystemService.retreivedUserData$
        ),
        // Change filter to explicitly check for non-null data
        filter(data => data !== null && data !== undefined),
        distinctUntilChanged((prev, curr) =>
          JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe(data => {
        if (data) {
          this.newUserForm.patchValue(data);
        }
        return this.traineeInsystemService.retreivedUserData$; // Otherwise fallback to retrievedUserData$
      })
  }


  onSubmit() {


    const formData = this.newUserForm;

    const otherFieldsValid = Object.keys(formData.controls)
      .filter(key => key !== 'email')
      .every(key => {
        const control = formData.get(key);
        return control?.valid;
      })

    if(otherFieldsValid) {
      this.setFirstFormState();
      this.goToSecondSection();
    }
    else {
      this.newUserForm.markAllAsTouched()
    }
  }

  setFirstFormState() {
    this.traineeInsystemService.setFirstFormState(this.newUserForm.value);
  }

  emailAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const trimmedValue = (control.value || '').trim();

    if (!trimmedValue) {
      return of(null);
    }

    return this.traineeInsystemService.checkEmail(trimmedValue).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      map(response => {
        return response ? { emailExists: true } : null;
      }),
      catchError(() => of(null))
    );
  }



  goToSecondSection() {
    this.router.navigate(['/home/admin/user-management/section-two']);
  }

  goBack() {
    this.resetFormFields();
    this.router.navigate(['/home/admin/user-management'])
  }

  resetFormFields() {
    this.unsubscribe$.next(); // Stop active subscriptions

    // Reset service-related states
    this.newUserForm.reset();
    this.traineeInsystemService.selectedEmailSubject.next(null);
    this.traineeInsystemService.setFirstFormState(null);
    this.traineeInsystemService.setSecondFormState(null);
    this.traineeInsystemService.retreivedUserDataSubject.next(null)
  }


  //Image upload
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);

      this.newUserForm.patchValue({ userProfilePhoto: this.selectedFile });
    }
  }

  triggerFileSelect() {
    this.fileInput.nativeElement.click();
  }

  changeImage() {
    this.triggerFileSelect();
  }

  setMaxDateOfBirth() {
    const today = new Date();
    // Calculate the date 7 years ago
    const sevenYearsAgo = new Date(today);
    sevenYearsAgo.setFullYear(today.getFullYear() - 7);
    this.maxDate = this.formatDate(sevenYearsAgo);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
