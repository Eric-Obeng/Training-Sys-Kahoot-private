import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CohortDataService } from '../../../core/services/cohort-data/cohort-data.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import { Observable } from 'rxjs';
import { Cohort, CohortList } from '../../../core/models/cohort.interface';
import { ModalComponent } from '../../../core/shared/modal/modal.component';
import { InputFieldComponent } from '../../../core/shared/input-field/input-field.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-update-cohort',
  standalone: true,
  imports: [ModalComponent, InputFieldComponent, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './update-cohort.component.html',
  styleUrl: './update-cohort.component.scss'
})
export class UpdateCohortComponent {
  newCohortForm!: FormGroup;
  isModalOpen: boolean = false;
  editBtnClicked: boolean = true;
  retrievedCohortForm$!: Observable<Cohort>;

  formData!: Observable<CohortList>; // holds form data received from backend
  
  allSpecializations = [
    { label: 'UI/UX', value: 'UI/UX' },
    { label: 'Frontend Engineering', value: 'Frontend' },
    { label: 'Backend Engineering', value: 'Backend' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public modalService: ModalService,
    public cohortDataService: CohortDataService,
  ) {}

  ngOnInit() {
    this.newCohortForm = this.fb.group({
      name: ['', Validators.required],
      specialization: this.fb.array([this.fb.control('', Validators.required)]),
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['']
    })

    // Set data into form from get request

    this.retrievedCohortForm$ = this.cohortDataService.getCohortFormData();
    this.retrievedCohortForm$.subscribe(data => {
      if(data) {
        // Populate the form with cohort data
        this.newCohortForm.patchValue({
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          description: data.description
        });

        // Populate specialization array
        const specializationArray = this.newCohortForm.get('specialization') as FormArray;
        specializationArray.clear(); // Clear existing controls
        data.specialization.forEach((spec: string) => {
          specializationArray.push(this.fb.control(spec, Validators.required));
        });
      }
    })
    // this.cohortDataService.getCohortFormData().subscribe(data => {
    //   if(data) {
    //     // Populate the form with cohort data
    //     this.newCohortForm.patchValue({
    //       name: data.name,
    //       startDate: data.startDate,
    //       endDate: data.endDate,
    //       description: data.description
    //     });

    //     // Populate specialization array
    //     const specializationArray = this.newCohortForm.get('specialization') as FormArray;
    //     specializationArray.clear(); // Clear existing controls
    //     data.specialization.forEach((spec: string) => {
    //       specializationArray.push(this.fb.control(spec, Validators.required));
    //     });
    //   }
    // })

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

  // Get filtered options for each select based on other selections
  getFilteredSpecializations(currentIndex: number): { label: string; value: string }[] {
    const selectedValues = this.specialization.controls.map(
      control => control.get('specialization')?.value
    );
    return this.allSpecializations.filter(
      option => !selectedValues.includes(option.value) || selectedValues[currentIndex] === option.value
    );
  }

  // Submit form
  onSubmit() {
    if(this.newCohortForm.valid) {
      this.cohortDataService.updateCohort(this.newCohortForm.value).subscribe({
        next: (response) => {
          console.log('Data submitted successfully', response);
        },
        error: (error) => { 
          console.error('Error submitting data', error);
        }
      }) 
      this.modalService.toggleSuccessModal()
      this.newCohortForm.reset();   
    }
    else {
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