import { curriculum } from './../../../../../core/models/curriculum.interface';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { ModuleComponent } from "./module/module.component";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CurriculumStateService } from '@core/services/curriculum-state/curriculum-state.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [MatRipple, NgIf,NgFor,
    ModuleComponent,ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})

export class FormComponent implements OnInit {
  isEditMode: boolean = false;
  curriculumForm!: FormGroup;
  curriculumData!: curriculum;
  previewImage: string | null = null
  private allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private curriculumStateService: CurriculumStateService
  ) {}


  navigateToList(){
    this.router.navigate(['home','admin','curriculum','list']);
  }

  private navigateToCreateModule(){
    this.router.navigate(['home','admin','curriculum','create','create-module']);
  }

  ngOnInit(): void {
    this.prepareCurriculumForm();
  }

  private prepareCurriculumForm() {
    this.curriculumForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      assignedSpecialization: ['', [Validators.required]],
      assignedCohort: ['', [Validators.required]],
      learningObjectives: this.fb.array([
        this.fb.control('', [Validators.required])
      ]),
      thumbnail: [null],
      modules: this.fb.array([])
    });
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File) {
    if (this.allowedFileTypes.includes(file.type)) {
      // Update form control
      this.curriculumForm.patchValue({
        thumbnail: file
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload only supported image formats (PNG, JPG, JPEG, WEBP)');
    }
  }

  removeImage() {
    this.previewImage = null;
    this.curriculumForm.patchValue({
      thumbnail: null
    });
  }

  get learningObjectives() {
    return this.curriculumForm.get('learningObjectives') as FormArray;
  }

  get modules() {
    return this.curriculumForm.get('modules') as FormArray;
  }

  addLearningObjective() {
    this.learningObjectives.push(
      this.fb.control('', [Validators.required])
    );
  }

  removeLearningObjective(index: number) {
    if (this.learningObjectives.length > 1) {
      this.learningObjectives.removeAt(index);
    }
  }

  onContinue() {
    // if (this.curriculumForm.valid) {
      this.curriculumStateService.setCurriculumForm(this.curriculumForm);
      this.router.navigate(['home', 'admin', 'curriculum', 'create', 'create-module']);
    // }
  }


  onCurriculumComplete() {
    const curriculumData: curriculum = this.curriculumForm.value;
    console.log('Final curriculum data:', curriculumData);

  }

}

