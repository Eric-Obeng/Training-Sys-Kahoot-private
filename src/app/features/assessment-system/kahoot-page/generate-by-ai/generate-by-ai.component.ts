import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { QuestionCardComponent } from '../question-card/question-card.component';
import { Question } from '@core/models/kahoot-questions';
import { KahootService } from '@core/services/assessment/kahoot/kahoot.service';
import { CommonModule } from '@angular/common';
import { initializeDropdownOptions } from '../../../../utils/kahootDropDownData';
import { LoaderComponent } from '../../../../core/shared/loader/loader.component';

@Component({
  selector: 'app-generate-by-ai',
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    QuestionCardComponent,
    CommonModule,
    LoaderComponent
],
  templateUrl: './generate-by-ai.component.html',
  styleUrl: './generate-by-ai.component.scss',
})
export class GenerateByAiComponent implements OnInit {
  quizzes: Question[] = [];
  addedQuestions: Question[] = [];
  levels: { name: string }[] | undefined;
  questionType: { name: string }[] | undefined;
  includeCode: { name: string }[] | undefined;
  errorMessage = '';

  generateQuizForm!: FormGroup;
  isLoading = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() questionsAdded = new EventEmitter<Question[]>();
  @ViewChild(QuestionCardComponent)
  questionCardComponent!: QuestionCardComponent;

  constructor(private fb: FormBuilder, private kahootService: KahootService) {}

  ngOnInit(): void {
    const dropdownOptions = initializeDropdownOptions();
    this.levels = dropdownOptions.levels;
    this.questionType = dropdownOptions.questionType;
    this.includeCode = dropdownOptions.includeCode;
    this.onGenerateQuizForm();

    this.kahootService.getGenerateQuiz().subscribe({
      next: (response) => {
        this.quizzes = response;
      },
    });
  }

  onGenerateQuizForm(): void {
    this.generateQuizForm = this.fb.group({
      level: ['', [Validators.required]],
      questionType: [''],
      includeCode: [''],
      topic: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.quizzes = [];
    this.errorMessage = '';

    if (this.generateQuizForm.valid) {
      const formValue = this.generateQuizForm.value;
      const formattedValue = {
        level: formValue.level.name,
        questionType: formValue.questionType.value,
        includeCode: formValue.includeCode.name,
        topic: formValue.topic,
      };
      this.kahootService.generateQuiz(formattedValue).subscribe({
        next: (response: Question[]) => {
          this.quizzes = response;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  onClose() {
    this.closeModal.emit();
  }

  onAddQuestionToKahootQuestions(question: Question) {
    question.timeLimit = { name: '15 seconds', value: 15 };
    question.points = { name: 'Standard', value: 50 };
    this.addedQuestions.push(question);
    this.questionsAdded.emit([...this.addedQuestions]);
  }

  onAddAllQuestions() {
    this.quizzes.forEach((quiz) => {
      quiz.timeLimit = { name: '15 seconds', value: 15 },
      quiz.points = { name: 'Standard', value: 50 };
    });
    this.addedQuestions.push(...this.quizzes);
  }

  onDone() {
    this.questionsAdded.emit(this.addedQuestions);
  }

  onQuestionsUpdated(updatedQuestions: Question[]) {
    this.addedQuestions = updatedQuestions;
  }
}
