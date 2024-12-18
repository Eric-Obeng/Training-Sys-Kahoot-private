import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InputFieldComponent } from '../../../../core/shared/input-field/input-field.component';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, filter, first, map, of, switchMap, tap, } from 'rxjs';
import { Countries, Gender, Specialization, User } from '../../../../core/models/cohort.interface';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { TraineeInsystemService } from '../../../../core/services/user-management/trainee/trainee-insystem.service';
import { UserManagementTraineeService } from '@core/services/user-management/trainee/user-management-trainee.service';
import { specialization } from '@core/models/specialization.interface';

@Component({
  selector: 'app-add-user-form',
  standalone: true,
  imports: [InputFieldComponent, ReactiveFormsModule, FormsModule, AsyncPipe, NgFor, NgIf],
  templateUrl: './add-user-form.component.html',
  styleUrl: './add-user-form.component.scss'
})
export class AddUserFormComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  newUserForm!: FormGroup;
  genders$!: Observable<Gender[]>;
  countries$!: Observable<Countries[]>;

  restCountries$!: any;
  

  //Image upload
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile!: File;
  
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public traineeInsystemService: TraineeInsystemService,
    public usermanagementService: UserManagementTraineeService,
  ) {}

  ngOnInit() {


    this.restCountries$ = this.usermanagementService.getAllCountries().pipe(
      map((response: any) => {
        const data = Object.entries(response.data).map(([key, value], id) => ({ key, value, id }));
        console.log(data)
        return data;
      })
    )
    // this.restCountries$.subscribe((data: any) => console.log(data.data))

    this.genders$ = this.usermanagementService.getAllGenders();
    this.countries$ = this.usermanagementService.getAllCountries()

    this.newUserForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailAsyncValidator.bind(this)]
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', ],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      universityCompleted: ['', Validators.required],
      userProfilePhoto: ['']
    })

    this.traineeInsystemService.retreivedUserData$
      .subscribe(data=> {
        if (data) {
          console.log(data)
          this.newUserForm.patchValue(data);
        }
      });
  }

  onSubmit() {
    const formData = this.newUserForm;

    if(!formData.invalid) {
      this.setFirstFormState();
      this.goToSecondSection();
    }
    else {
      formData.markAllAsTouched()
    }

  }

  setFirstFormState() {
    this.traineeInsystemService.setFirstFormState(this.newUserForm.value)
  }

  emailAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const trimmedValue = (control.value || '').trim(); // Normalize input
    if (!trimmedValue) {
      return of(null);
    }
  
    return this.traineeInsystemService.checkEmail(trimmedValue).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(response => 
        response?.length ? of({ emailExists: true }) : of(null)
      ),
      catchError(() => of(null)),
      first()
    );
  }

  goToSecondSection() {
    this.router.navigate(['/home/admin/user-management/section-two'])
  }


  goBack() {
    this.newUserForm.reset()
    this.router.navigate(['/home/admin/user-management'])
  }


  //Image upload
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if(fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  triggerFileSelect() {
    this.fileInput.nativeElement.click();
  }

  changeImage() {
    this.triggerFileSelect();
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
