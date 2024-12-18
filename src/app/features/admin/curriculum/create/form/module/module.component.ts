import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatRipple } from '@angular/material/core';
import { uploadedFile } from '@core/models/file.interface';
import { AccordionModule } from 'primeng/accordion';
import { ModuleListComponent } from "../module-list/module-list.component";
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CurriculumStateService } from '@core/services/curriculum-state/curriculum-state.service';
import { FeedbackModalComponent } from "../../../../../../core/shared/feedback-modal/feedback-modal.component";
import { CurriculumFacadeService } from '@core/services/curriculum-facade/curriculum-facade.service';
import { curriculum } from '@core/models/curriculum.interface';
import { FileUploadService } from '@core/services/file-upload/file-upload.service';


@Component({
  selector: 'app-module',
  standalone: true,
  imports: [MatRipple, ReactiveFormsModule,
    CommonModule, AccordionModule, ModuleListComponent, FeedbackModalComponent],
  templateUrl: './module.component.html',
  styleUrl: './module.component.scss'
})


export class ModuleComponent implements OnInit {
  parentForm!: FormGroup;
  private formSubscription: Subscription | null = null;
  showFeedback: boolean = false;
  curriculums: curriculum[] = []

  activeModuleIndex = 0;
  readonly allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'application/pdf'];
  dragOver: { [key: number]: boolean } = {};
  uploadedFiles: { [key: number]: uploadedFile[] } = {};

  constructor(
    private fb: FormBuilder,
    private curriculumStateService: CurriculumStateService,
    private router: Router,
    private curriculumService: CurriculumFacadeService,
    private fileUploadService: FileUploadService
  ) {
    this.parentForm = this.fb.group({
      modules: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.formSubscription = this.curriculumStateService.getCurriculumForm()
    .subscribe(form => {
      if (form) {
        this.parentForm = form;
        if (this.modules.length === 0) {
          this.addModule();
        }
      } else {
        this.router.navigate(['home', 'admin', 'curriculum', 'create-curriculum']);
      }
    });

    this.curriculumService.curriculum$.subscribe((curriculums: curriculum[]) => {
      this.curriculums = curriculums;
    });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  get modules(): FormArray {
    return this.parentForm?.get('modules') as FormArray;
  }

  navigateToCreateCurriculum(){
    this.router.navigate(['home', 'admin', 'curriculum-management', 'create-curriculum']);
  }

  getTopics(moduleIndex: number): FormArray {
    return this.modules.at(moduleIndex).get('topics') as FormArray;
  }

  addModule(): void {
    const moduleGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      topics: this.fb.array([this.fb.control('', Validators.required)]),
      files: []
    });
    this.modules.push(moduleGroup);
    this.uploadedFiles[this.modules.length - 1] = [];
  }

  onModuleSelected(index: number): void {
    this.activeModuleIndex = index;
  }

  onModuleRemoved(index: number): void {
    this.removeModule(index);
  }


  get formControls(){
    return {
      title: this.parentForm.get('title'),
      description: this.parentForm.get('description'),
      topics: this.parentForm.get('topics')
    };
  }

  onCreateCurriculum(): void {
    if (this.parentForm?.valid) {
      this.showFeedback = true;
      const formData = this.parentForm.value;
      const formattedModules = formData.modules.map((module: any, index: number) => ({
        ...module,
        files: this.uploadedFiles[index]?.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })) || []
      }));
      const curriculumData = {
        ...formData,
        modules: formattedModules,
        id: this.curriculums.length + 1,
        createdAt: new Date().toISOString()
      };
      this.curriculumService.create(curriculumData).subscribe({
        next: () => {
          setTimeout(() => {
            this.showFeedback = false;
            this.router.navigate(['home', 'admin', 'curriculum-management']);
          }, 3000);
        },
        error: (error) => {
          this.showFeedback = false;
          console.error('Error creating curriculum:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.parentForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  selectModule(index: number): void {
    this.activeModuleIndex = index;
  }

  removeModule(moduleIndex: number): void {
    this.modules.removeAt(moduleIndex);
    delete this.uploadedFiles[moduleIndex];
    const newUploadedFiles: { [key: number]: uploadedFile[] } = {};
    Object.keys(this.uploadedFiles).forEach((key) => {
      const numKey = parseInt(key);
      if (numKey > moduleIndex) {
        newUploadedFiles[numKey - 1] = this.uploadedFiles[numKey];
      } else if (numKey < moduleIndex) {
        newUploadedFiles[numKey] = this.uploadedFiles[numKey];
      }
    });
    this.uploadedFiles = newUploadedFiles;
  }

  addTopic(moduleIndex: number): void {
    const topicsArray = this.getTopics(moduleIndex);
    topicsArray.push(this.fb.control('', Validators.required));
  }

  removeTopic(moduleIndex: number, topicIndex: number): void {
    const topicsArray = this.getTopics(moduleIndex);
    if (topicsArray.length > 1) {
      topicsArray.removeAt(topicIndex);
    }
  }

  onFileDropped(event: DragEvent, moduleIndex: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver[moduleIndex] = false;
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.processFile(files[0], moduleIndex);
    }
  }


  private processFile(file: File, moduleIndex: number): void {
    const uploadedFile = this.fileUploadService.handleFile(file);
    if (uploadedFile) {
      if (!this.uploadedFiles[moduleIndex]) {
        this.uploadedFiles[moduleIndex] = [];
      }
      this.uploadedFiles[moduleIndex].push(uploadedFile);
      const moduleGroup = this.modules.at(moduleIndex);
      const files = this.uploadedFiles[moduleIndex].map(f => f.file);
      moduleGroup.patchValue({
        moduleFile: files
      });
    } else {
      alert('Please upload only PNG, JPG, JPEG, WEBP, or PDF files');
    }
  }

  onDragOver(event: DragEvent, moduleIndex: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver[moduleIndex] = true;
  }

  onDragLeave(event: DragEvent, moduleIndex: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver[moduleIndex] = false;
  }

  onFileSelected(event: Event, moduleIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.processFile(input.files[0], moduleIndex);
    }
  }

  removeFile(moduleIndex: number, fileIndex: number): void {
    this.uploadedFiles[moduleIndex].splice(fileIndex, 1);
    const moduleGroup = this.modules.at(moduleIndex);
    const remainingFiles = this.uploadedFiles[moduleIndex].map(f => f.file);
    moduleGroup.patchValue({
      files: remainingFiles
    });
  }

  getFileIcon(fileType: string): string {
    return this.fileUploadService.getFileIcon(fileType);
  }

  getFileList(moduleIndex: number): uploadedFile[] {
    return this.uploadedFiles[moduleIndex] || [];
  }
}
