import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CohortDataService } from '../../../../core/services/cohort-data/cohort-data.service';
import { ModalService } from '../../../../core/services/modal/modal.service';
import { ModalComponent } from '../../../../core/shared/modal/modal.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { InputFieldComponent } from '../../../../core/shared/input-field/input-field.component';
import { Observable } from 'rxjs';
import { UserManagementTraineeService } from '@core/services/user-management/trainee/user-management-trainee.service';
import { Specialization } from '@core/models/cohort.interface';

@Component({
  selector: 'app-edit-cohort',
  standalone: true,
  imports: [InputFieldComponent, ModalComponent, ReactiveFormsModule, NgIf, NgFor, AsyncPipe],
  templateUrl: './edit-cohort.component.html',
  styleUrl: './edit-cohort.component.scss'
})
export class EditCohortComponent {

  newCohortForm!: FormGroup;
  isModalOpen: boolean = false;
  editBtnClicked: boolean = true;

  allSpecializations$!: Observable<Specialization[]>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public modalService: ModalService,
    public cohortDataService: CohortDataService,
    public usermanagementservice: UserManagementTraineeService,
  ) {}

  ngOnInit() {

    this.allSpecializations$ = this.usermanagementservice.getAllspecializations();

    this.newCohortForm = this.fb.group({
      name: ['', Validators.required],
      specialization: this.fb.array([this.fb.control('', Validators.required)]),
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['']
    })

    // Set data into form from create cohort form
    this.cohortDataService.createCohortFormData$.subscribe((cohortData) => {
      if (cohortData) {
        // Populate the form with cohort data
        this.newCohortForm.patchValue({
          name: cohortData.name,
          specialization: this.fb.array([this.fb.control('', Validators.required)]),
          startDate: cohortData.startDate,
          endDate: cohortData.endDate,
          description: cohortData.description
        });

        // Populate specialization array
        const specializationArray = this.newCohortForm.get('specialization') as FormArray;
        specializationArray.clear(); // Clear existing controls
        cohortData.specialization.forEach((spec: string) => {
          specializationArray.push(this.fb.control(spec, Validators.required));
          console.log(spec);
        });
      }
    });

    // Disable input fields on initialization
    if (this.editBtnClicked === true) {
      this.disableFields();
    }

  }


  // Get specializations for from form
  get specialization(): FormArray {
    return this.newCohortForm.get('specialization') as FormArray;
  }


  // Add new specialization element to dom
  addSpecialization(): void {
    this.specialization.push(this.fb.control('', Validators.required));
  }

  // Remove specialization with specified index
  removeSpecialization(index: number) {
    if(this.specialization.length > 1) {
      this.specialization.removeAt(index);
    }
  }

  // Submit form
  onSubmit() {
    if(this.newCohortForm.valid) { 
      console.log("form: ", this.newCohortForm)
      this.cohortDataService.addCohort(this.newCohortForm.value).subscribe({
        next: (response) => {            
          console.log('Data submitted successfully', response);
        },
        error: (error) => { 
          console.error('Error submitting data', error);
        }
      })
      this.newCohortForm.reset();
      this.modalService.toggleSuccessModal()
    }
    else {
      console.log("Not valid")
      this.newCohortForm.markAllAsTouched();
    }
  }

  // Disable specializiation fields
  disableFields() {
    this.specialization.controls.forEach(control => {
      control.disable();
    });
    this.newCohortForm.get('description')?.disable();
  }
  // Enable specialization fields
  enableFields() {
    this.specialization.controls.forEach(control => {
      control.enable();
    });
    this.newCohortForm.get('description')?.enable();
  }

  toggleEditBtn() {
    this.editBtnClicked = !this.editBtnClicked;

    if (this.editBtnClicked === true) {
      this.disableFields();
    }
    else if(this.editBtnClicked === false) {
      this.enableFields();
    }
  }


  // Navigate to list of cohorts
  goBack() {
    this.router.navigate(['/home/admin/cohorts'])
  }
  
}
