import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { specialization } from '@core/models/specialization.interface';
import { SpecializationFacadeService } from '@core/services/specialization-facade/specialization-facade.service';
import { AddFeedbackComponent } from "../add-feedback/add-feedback.component";


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,
    MatButtonModule,MatRipple],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})

export class FormComponent implements OnInit {
  @Input() initialData?: specialization ;
  @Output() formSubmit = new EventEmitter<specialization>();

  specializationForm!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder,
    private  specializationFacade: SpecializationFacadeService
  ) {}

  ngOnInit() {
    this.initializeForm();
    if (this.initialData) {
      this.patchFormWithData();
    }
    this.specializationFacade.selectedSpecialization$
    .subscribe( data =>  this.initialData = data )
  }

  private initializeForm() {
    this.specializationForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      prerequisites: this.fb.array([
        ['', Validators.required]
      ])
    });
  }

  private patchFormWithData() {
    if (!this.initialData) return;
    this.isEditMode = true;
    while (this.prerequisites?.length) {
      this.prerequisites.removeAt(0);
    }
    this.initialData.prerequisites.forEach(prereq => {
      this.prerequisites?.push(this.fb.control(prereq, Validators.required));
    });
    this.specializationForm?.patchValue({
      name: this.initialData.name,
      description: this.initialData.description
    });
  }

  get prerequisites(): FormArray {
    return this.specializationForm?.get('prerequisites') as FormArray;
  }

  addSkill(): void {
    this.prerequisites.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number): void {
    if (this.prerequisites.length > 1) {
      this.prerequisites.removeAt(index);
    }
  }

  private prepareFormData(){
    const formValue = this.specializationForm.value;
      const prerequisites = formValue.prerequisites.filter((prereq: string) => prereq.trim() !== '');
      const specialization: specialization = {
        ...(this.initialData?.id && { id: this.initialData.id }),
        name: formValue.name,
        description: formValue.description,
        prerequisites: prerequisites,
        createdAt: this.isEditMode && this.initialData
        ? this.initialData.createdAt
        : new Date().toISOString().split('T')[0],
      };
      this.formSubmit.emit(specialization);
      if (!this.isEditMode) {
        this.specializationForm.reset();
        this.initializeForm();
      }
  }

  submitForm(): void {
    if (this.specializationForm.valid) {
      this.prepareFormData()
    }
  }
}
