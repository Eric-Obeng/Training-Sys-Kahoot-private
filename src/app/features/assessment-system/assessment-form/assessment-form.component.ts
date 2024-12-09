import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  AssessmentData,
  AssessmentType,
  Quiz,
} from '@core/models/assessment-form.interface';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizDataService } from '@core/services/assessment/quiz-data.service';
import { AssessmentService } from '@core/services/assessment/assessment.service';

@Component({
  selector: 'app-assessment-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './assessment-form.component.html',
  styleUrl: './assessment-form.component.scss',
})
export class AssessmentFormComponent {
  @Input() type: AssessmentType = 'lab';
  @Output() formSubmit = new EventEmitter<AssessmentData>();

  selectedFileName: string = '';
  upLoadedFile: string = '';

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private quizDataService: QuizDataService,
    private assessmentService: AssessmentService
  ) {
    this.form = this.fb.group({
      assessmentType: ['', Validators.required],
      title: ['', Validators.required],
      focusArea: ['', Validators.required],
      description: ['', Validators.required],
      coverImage: [null],
      attachments: [[]],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const type = params.get('type');
      if (type) {
        this.type = type as AssessmentType;
      }
      this.form.patchValue({
        assessmentType: this.type,
      });
    });
  }

  onCoverImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.form.patchValue({
        coverImage: file,
      });
    }
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    if (files.length) {
      this.upLoadedFile = files[0].name;
      this.form.patchValue({
        attachments: files,
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = new FormData();
      Object.keys(this.form.value).forEach((key) => {
        if (key === 'attachments') {
          this.form.value[key].forEach((file: File) => {
            formData.append('attachments', file, file.name);
          });
        } else {
          formData.append(key, this.form.value[key]);
        }
      });
      formData.append('assessmentType', this.type);

      if (this.type === 'quiz') {
        formData.delete('attachments');
        this.quizDataService.setQuizData(formData, true).subscribe({
          next: (response) => {
            this.router.navigate(['/home/trainer/assessment/quiz-creation']);
            localStorage.setItem('quizId', JSON.stringify(response));
          },
          error: (err) => {
            console.error(err);
          },
        });
      } else if (this.type === 'lab') {
        this.assessmentService.createLab(formData).subscribe(() => {});
      }
    }
  }

  submitQuizWithQuestions(questions: Quiz[]) {
    this.quizDataService.getQuizData().subscribe((formData) => {
      if (formData) {
        formData.quizzes = questions;
        this.formSubmit.emit(formData);
        this.quizDataService.clearQuizData();
      }
    });
  }
}
