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
      specializations: this.fb.array([this.fb.control('', Validators.required)]),
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['']
    })

    // Set data into form from create cohort form
    this.cohortDataService.createCohortFormData$.subscribe((cohortData) => {      
      if (cohortData) {
        const specializations = Array.isArray(cohortData.specializations) 
          ? cohortData.specializations 
          : [cohortData.specializations].filter(Boolean);
    
        this.newCohortForm.patchValue({
          name: cohortData.name,
          startDate: cohortData.startDate,
          endDate: cohortData.endDate,
          description: cohortData.description
        });
    
        const specializationArray = this.newCohortForm.get('specializations') as FormArray;
        specializationArray.clear();
        specializations.forEach((specId) => {
          specializationArray.push(this.fb.control(specId, Validators.required));
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
      const formValue = {
        ...this.newCohortForm.value,
        specializationIds: this.specializations.value,
        description: this.newCohortForm.get('description')?.value,
      };
  
      // Remove original specializations
      delete formValue.specializations;
  
      this.cohortDataService.addCohort(formValue).subscribe({
        next: () => {
          this.modalService.toggleSuccessModal();
          // this.goBack(); 
        },
        error: (err) => {
          console.error('Submission error', err);
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
  // Enable specializations fields
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

  toggleSuccessModal() {
    this.isModalOpen = !this.isModalOpen;
  }
  
}
