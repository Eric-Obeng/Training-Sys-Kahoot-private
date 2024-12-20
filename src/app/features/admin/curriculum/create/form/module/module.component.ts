import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatRipple } from '@angular/material/core';
import { uploadedFile } from '@core/models/file.interface';
import { AccordionModule } from 'primeng/accordion';
import { ModuleListComponent } from "../module-list/module-list.component";
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CurriculumStateService } from '@core/services/curriculum-state/curriculum-state.service';
import { FeedbackModalComponent } from "@core/shared/feedback-modal/feedback-modal.component";
import { CurriculumFacadeService } from '@core/services/curriculum-facade/curriculum-facade.service';
import { curriculum, module, moduleFile } from '@core/models/curriculum.interface';
import { FileUploadService } from '@core/services/file-upload/file-upload.service';
import { convertISODurationToMinutes,  } from "@core/utils/duration";
import { getFileTypeFromUrl, extractFileNameFromUrl,  } from "@core/utils/urlToFile";
import { truncateFileName  } from "@core/utils/filename";
import { ErrorHandleService } from '@core/services/error-handle/error-handle.service';


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
  curriculums: curriculum[] = [];
  isUpdate: boolean = false;
  curriculumId: string | null = null;
  isLoading = false;

  activeModuleIndex = 0;
  readonly allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'application/pdf'];
  dragOver: { [key: number]: boolean } = {};
  uploadedFiles: { [key: number]: uploadedFile[] } = {};

  constructor(
    private fb: FormBuilder,
    private curriculumStateService: CurriculumStateService,
    private router: Router,
    private route: ActivatedRoute,
    private curriculumService: CurriculumFacadeService,
    private fileUploadService: FileUploadService,
    private errorHandleService: ErrorHandleService

  ) {
    this.parentForm = this.fb.group({
      modules: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.curriculumId = params['id'];
        this.isUpdate = true;
          this.curriculumService.getSelectedCurriculum(this.curriculumId).subscribe(curriculum => {
          if (curriculum) {
            while (this.modules.length) {
              this.modules.removeAt(0);
            }
            curriculum.modules.forEach((module: any) => {
              const moduleGroup = this.createModuleGroup(module);
              this.modules.push(moduleGroup);
              const moduleIndex = this.modules.length - 1;
              this.uploadedFiles[moduleIndex] = (module.fileUrl || module.moduleFile || []).map((file: string | moduleFile) => ({
                name: typeof file === 'string'
                  ? extractFileNameFromUrl(file)
                  : file.name,
                size: typeof file === 'string'
                  ? 'N/A'
                  : file.size,
                type: typeof file === 'string'
                  ? getFileTypeFromUrl(file)
                  : file.type,
                file: file
              }));
            });
          }
        });
      }
    });

    this.formSubscription = this.curriculumStateService.getCurriculumForm()
    .subscribe(form => {
      if (form) {
        this.parentForm = form;
        if (this.modules.length === 0) {
          this.addModule();
        }
      } else {
        this.router.navigate(['home', 'admin', 'curriculum-management', 'create-curriculum']);
      }
    });

    this.curriculumService.curriculum$.subscribe((curriculums: curriculum[]) => {
      this.curriculums = curriculums;
    });
  }

  shortFileName(name: string){
    return truncateFileName(name);
  }

  private createModuleGroup(existingModule?: module) {
    return this.fb.group({
      title: [existingModule?.title || '', Validators.required],
      description: [existingModule?.description || '', Validators.required],
      estimatedTimeMinutes: [
        convertISODurationToMinutes(existingModule?.estimatedTime?.toString()) || 0,
        Validators.required],
      topics: this.fb.array(
        Array.isArray(existingModule?.topics)
          ? existingModule.topics.map((topic: string) => this.fb.control(topic, Validators.required))
          : [this.fb.control('', Validators.required)]
      ),
      moduleFile: this.fb.array(
        Array.isArray(existingModule?.moduleFile)
          ? existingModule.moduleFile.map(file => this.fb.group({
              file: file || null
            }))
          : []
      )
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
  
  navigateToList(){
    this.router.navigate(['home', 'admin', 'curriculum-management', ]);
  }

  getTopics(moduleIndex: number): FormArray {
    return this.modules.at(moduleIndex).get('topics') as FormArray;
  }


  addModule(): void {
    const moduleGroup = this.createModuleGroup();
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
      estimatedTimeMinutes : this.parentForm.get('estimatedTimeMinutes'),
      topics: this.parentForm.get('topics'),
    };
  }

  onCreateCurriculum(): void {
    if (this.parentForm?.valid) {
      this.isLoading = true;
      const formData = this.parentForm.value;
      const formattedModules = formData.modules.map((module: any, index: number) => ({
        ...module,
        moduleFile: this.uploadedFiles[index]?.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file.file
        })) || []
      }));

      const curriculumData: curriculum = {
        ...formData,
        modules: formattedModules
      };

      if (this.isUpdate && this.curriculumId) {
        this.curriculumService.update(this.curriculumId, curriculumData).subscribe({
          next: () => {
            this.isLoading = false;
            this.showFeedback = true;
            setTimeout(()=>{
              this.showFeedback = false;
              this.navigateToList();
            },2000) 
            this.errorHandleService.showSuccessSnackbar('Curriculum updated successfully');
          },
          error: (error) => {
            this.isLoading = false;
            this.errorHandleService.handleError(error);
          }
        });
      } else {
        this.curriculumService.create(curriculumData).subscribe({
          next: () => {
            this.isLoading = false;
            this.showFeedback = true;
            setTimeout(()=>{
              this.showFeedback = false;
              this.navigateToList();
            },2000) 
            this.errorHandleService.showSuccessSnackbar('Curriculum created successfully');
          },
          error: (error) => {
            this.isLoading = false;
            this.errorHandleService.handleError(error);
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.parentForm);
      this.errorHandleService.showErrorSnackbar('Please fill in all required fields');
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
    if (!this.allowedFileTypes.includes(file.type)) {
      alert('Please upload only PNG, JPG, JPEG, WEBP, or PDF files');
      return;
    }

    if (!this.uploadedFiles[moduleIndex]) {
      this.uploadedFiles[moduleIndex] = [];
    }

    const newFile = {
      name: file.name,
      size: this.fileUploadService.formatFileSize(file.size),
      type: file.type,
      file: file
    };

    this.uploadedFiles[moduleIndex].push(newFile);

    const moduleGroup = this.modules.at(moduleIndex) as FormGroup;
    const moduleFileArray = moduleGroup.get('moduleFile') as FormArray;

    moduleFileArray.push(this.fb.group({
      name: newFile.name,
      size: newFile.size,
      type: newFile.type,
      file: [newFile.file]
    }));
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
