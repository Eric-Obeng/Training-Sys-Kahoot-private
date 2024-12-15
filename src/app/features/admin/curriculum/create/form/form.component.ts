import { specialization } from './../../../../../core/models/specialization.interface';
import { curriculum } from './../../../../../core/models/curriculum.interface';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { ModuleComponent } from "./module/module.component";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CurriculumStateService } from '@core/services/curriculum-state/curriculum-state.service';
import { CurriculumFacadeService } from '@core/services/curriculum-facade/curriculum-facade.service';
import { Specialization } from '@core/models/cohort.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [MatRipple, NgIf,NgFor,
    ModuleComponent,ReactiveFormsModule,AsyncPipe],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})

export class FormComponent implements OnInit {
  showFeedback: boolean = false;
  isUpdate: boolean = false;
  isEditMode: boolean = false;
  curriculumForm!: FormGroup;
  curriculumData!: FormData;
  previewImage: string | null = null;
  curriculumId: string | null = null;
  allSpecializations$!: Observable<Specialization[]>;
  private allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private curriculumStateService: CurriculumStateService,
    private curriculumFacade: CurriculumFacadeService
  ) {}


  navigateToList(){
    this.router.navigate(['home','admin','curriculum-management']);
  }

  private navigateToCreateModule() {
    const queryParams = this.isUpdate ? { id: this.curriculumId } : {};
    this.router.navigate(
      ['home', 'admin', 'curriculum-management', 'create-curriculum', 'create-module'],
      { queryParams }
    );
  }


  ngOnInit(): void {
    this.allSpecializations$ = this.curriculumFacade.specialization$;
    this.prepareCurriculumForm();
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.curriculumId = params['id'];
        this.loadCurriculumData(params['id']);
        this.isUpdate = true;
      }
    });
  }

  get formControls() {
    return {
      title: this.curriculumForm.get('title'),
      description: this.curriculumForm.get('description'),
      specialization: this.curriculumForm.get('specialization'),
    };
  }

  private loadCurriculumData(id: string){
    this.curriculumFacade.getSelectedCurriculum(id).subscribe({
      next: (curriculum: curriculum) => {
        this.curriculumForm.patchValue({
          title: curriculum.title,
          description: curriculum.description,
          specialization: curriculum.specialization,
          thumbnailImage: curriculum.thumbnailImageUrl, 
        });
  
        
        if (curriculum.thumbnailImageUrl) {
          this.previewImage = curriculum.thumbnailImageUrl;
        }
  
        const learningObjectivesArray = this.curriculumForm.get('learningObjectives') as FormArray;
        learningObjectivesArray.clear();
        curriculum.learningObjectives.forEach(objective => {
          learningObjectivesArray.push(this.fb.control(objective, Validators.required));
        });
  
        this.curriculumStateService.setCurriculumForm(this.curriculumForm);
      },
      error: (error: any) => {
        console.error('Error loading curriculum:', error);
        this.navigateToList();
      }
    });
  }

  private prepareCurriculumForm() {
    this.curriculumForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      learningObjectives: this.fb.array([
        this.fb.control('', [Validators.required])
      ]),
      thumbnailImage: [''],
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
      this.curriculumForm.patchValue({
        thumbnailImage: file as File
      });
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.previewImage = null;
    this.curriculumForm.patchValue({
      thumbnailImage: null
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
    if (this.curriculumForm.valid) {
      this.curriculumStateService.setCurriculumForm(this.curriculumForm);
      this.navigateToCreateModule();
    } else {
      Object.keys(this.formControls).forEach(key => {
        const control = this.formControls[key as keyof typeof this.formControls];
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      this.learningObjectives.controls.forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
