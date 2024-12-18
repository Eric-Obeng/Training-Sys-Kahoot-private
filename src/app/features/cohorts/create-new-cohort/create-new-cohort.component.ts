import { Component } from '@angular/core';
import { InputFieldComponent } from "../../../core/shared/input-field/input-field.component";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { CohortDataService } from '../../../core/services/cohort-data/cohort-data.service';
import { Specialization } from '@core/models/cohort.interface';
import { Observable } from 'rxjs';
import { UserManagementTraineeService } from '@core/services/user-management/trainee/user-management-trainee.service';

@Component({
  selector: 'app-create-new-cohort',
  standalone: true,
  imports: [InputFieldComponent, ReactiveFormsModule, NgIf, NgFor, AsyncPipe],
  templateUrl: './create-new-cohort.component.html',
  styleUrl: './create-new-cohort.component.scss'
})
export class CreateNewCohortComponent {

  newCohortForm!: FormGroup;
  allSpecializations$!: Observable<Specialization[]>;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    public cohortDataService: CohortDataService,
    public usermanagementservice: UserManagementTraineeService,
  ) {}

  ngOnInit() {

    this.newCohortForm = this.fb.group({
      name: ['', Validators.required],
      specializations: this.fb.array([this.fb.control('', Validators.required)]),
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['']
    })

    this.allSpecializations$ = this.usermanagementservice.getAllspecializations();
  }

  // Get specializations for from form
  get specializations(): FormArray {
    return this.newCohortForm.get('specializations') as FormArray;
  }

  // Add new specialization element to dom
  addSpecialization(): void {
    this.specializations.push(this.fb.control('', Validators.required));
  }

  // Remove specializations with specified index
  removeSpecializations(index: number) {
    if(this.specializations.length > 1) {
      this.specializations.removeAt(index);
    }
  }

  // Submit form
  onSubmit() {
    if(this.newCohortForm.valid) {
      this.cohortDataService.setCohortFormData(this.newCohortForm.value)
      this.router.navigate(['/home/admin/cohorts/edit-cohort']);
    }
    else {
      this.newCohortForm.markAllAsTouched();
    }
  }

  // Navigate to list of cohorts
  goBack() {
    this.router.navigate(['/home/admin/cohorts'])
  }

}
