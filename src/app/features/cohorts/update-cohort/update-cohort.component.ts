import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CohortDataService } from '../../../core/services/cohort-data/cohort-data.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import { Observable } from 'rxjs';
import { Cohort, CohortDetails, CohortList, Specialization } from '../../../core/models/cohort.interface';
import { ModalComponent } from '../../../core/shared/modal/modal.component';
import { InputFieldComponent } from '../../../core/shared/input-field/input-field.component';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { UserManagementTraineeService } from '@core/services/user-management/trainee/user-management-trainee.service';

@Component({
  selector: 'app-update-cohort',
  standalone: true,
  imports: [ModalComponent, InputFieldComponent, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, JsonPipe],
  templateUrl: './update-cohort.component.html',
  styleUrl: './update-cohort.component.scss'
})
export class UpdateCohortComponent {
  newCohortForm!: FormGroup;
  isModalOpen: boolean = false;
  editBtnClicked: boolean = true;
  retrievedCohortForm$!: Observable<CohortDetails>;

  allSpecializations$!: Observable<Specialization[]>;

  formData!: Observable<CohortList>; // holds form data received from backend


  constructor(
    private fb: FormBuilder,
    private router: Router,
    public modalService: ModalService,
    public cohortDataService: CohortDataService,
    public usermanagementService: UserManagementTraineeService,
  ) {}

  ngOnInit() {
    this.allSpecializations$ = this.usermanagementService.getAllspecializations();

    this.newCohortForm = this.fb.group({
      name: ['', Validators.required],
      specializations: this.fb.array([this.fb.control('', Validators.required)]),
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['']
    })

    // Set data into form from get request
    this.retrievedCohortForm$ = this.cohortDataService.getSelectedCohortDetails();

    this.retrievedCohortForm$.subscribe((cohortData) => {
      
      if (cohortData) {
        // Normalize specializations to ensure it's always an array
        const specializations = Array.isArray(cohortData.specializations) 
          ? cohortData.specializations
          : (cohortData.specializations ? [cohortData.specializations] : []);
    
        // Patch form values
        this.newCohortForm.patchValue({
          name: cohortData.name,
          startDate: cohortData.startDate,
          endDate: cohortData.endDate,
          description: cohortData.description
        });
    
        // Rebuild specialization FormArray
        const specializationArray = this.newCohortForm.get('specializations') as FormArray;
        specializationArray.clear();
        specializations.forEach((spec: any) => {
          specializationArray.push(this.fb.control(spec.id, Validators.required));
        });
      }
    });

    // Disable input fields on initialization
    if (this.editBtnClicked === true) {
      this.disableFields();
    }

  }


  // Get specializations for from form
  get specializations(): FormArray {
    return this.newCohortForm.get('specializations') as FormArray;
  }


  // Add new specialization element to dom
  addSpecialization(): void {
    this.specializations.push(this.fb.control('', Validators.required));
  }

  // Remove specialization with specified index
  removeSpecialization(index: number) {
    if(this.specializations.length > 1) {
      this.specializations.removeAt(index);
    }
  }

  // Submit form
  onSubmit() {
    if(this.newCohortForm.valid) {
      const newForm = {
        ... this.newCohortForm.value,
        specializationIds: this.specializations.value
      }

      delete newForm.specializations;

      this.cohortDataService.updateCohort(newForm).subscribe({
        next: (res) => {
          this.modalService.toggleSuccessModal()
          this.newCohortForm.reset();  
        }
      })
       
    }
    else {
      this.newCohortForm.markAllAsTouched();
    }
  }

  // Disable specializiation fields
  disableFields() {
    this.specializations.controls.forEach(control => {
      control.disable();
    });
    this.newCohortForm.get('description')?.disable();
  }
  // Enable specialization fields
  enableFields() {
    this.specializations.controls.forEach(control => {
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
