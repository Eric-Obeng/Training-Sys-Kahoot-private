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



@Component({
  selector: 'app-module',
  standalone: true,
  imports: [MatRipple, ReactiveFormsModule,
    CommonModule, AccordionModule, ModuleListComponent],
  templateUrl: './module.component.html',
  styleUrl: './module.component.scss'
})


export class ModuleComponent implements OnInit {
  parentForm!: FormGroup;
  private formSubscription: Subscription | null = null;

  activeModuleIndex = 0;
  readonly allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'application/pdf'];
  dragOver: { [key: number]: boolean } = {};
  uploadedFiles: { [key: number]: uploadedFile[] } = {};

  constructor(
    private fb: FormBuilder,
    private curriculumStateService: CurriculumStateService,
    private router: Router
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
          this.router.navigate(['home', 'admin', 'curriculum', 'create', 'create-curriculum']);
        }
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
    this.router.navigate(['home', 'admin', 'curriculum', 'create']);
  }

  getTopics(moduleIndex: number): FormArray {
    return this.modules.at(moduleIndex).get('topics') as FormArray;
  }

  addModule(): void {
    const moduleGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      topics: this.fb.array([this.fb.control('', Validators.required)]),
      files: [[]]
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

  onCreateCurriculum(): void {
    if (this.parentForm?.valid) {
      console.log('Final curriculum data:', this.parentForm.value);
      this.router.navigate(['home', 'admin', 'curriculum', 'list']);
    }
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
      this.handleFile(files[0], moduleIndex);
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
      this.handleFile(input.files[0], moduleIndex);
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private handleFile(file: File, moduleIndex: number): void {
    if (this.allowedFileTypes.includes(file.type)) {
      if (!this.uploadedFiles[moduleIndex]) {
        this.uploadedFiles[moduleIndex] = [];
      }
      const newFile: uploadedFile = {
        file: file,
        name: file.name,
        size: this.formatFileSize(file.size),
        type: file.type
      };
      this.uploadedFiles[moduleIndex].push(newFile);
      const moduleGroup = this.modules.at(moduleIndex);
      const files = this.uploadedFiles[moduleIndex].map(f => f.file);
      moduleGroup.patchValue({
        files: files
      });
    } else {
      alert('Please upload only PNG, JPG, JPEG, WEBP, or PDF files');
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
    if (fileType.includes('pdf')) {
      return '../../../../../assets/Images/svg/pdf-icon.svg';
    } else if (fileType.includes('image')) {
      return '../../../../../assets/Images/svg/image-icon.svg';
    }
    return '../../../../../assets/Images/svg/file-icon.svg';
  }

  getFileList(moduleIndex: number): uploadedFile[] {
    return this.uploadedFiles[moduleIndex] || [];
  }
}
