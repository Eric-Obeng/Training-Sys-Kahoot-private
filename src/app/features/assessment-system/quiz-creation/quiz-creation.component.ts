import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { QuestionListItemComponent } from '../components/question-list-item/question-list-item.component';
import { CommonModule } from '@angular/common';
import { AnswerComponent } from '../components/answer/answer.component';
import {
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { AssessmentFormComponent } from '../assessment-form/assessment-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizDataService } from '@core/services/assessment/quiz-data.service';
import { AssessmentService } from '@core/services/assessment/assessment.service';
import { AssessmentData, Quiz } from '@core/models/assessment-form.interface';
import { FeedbackComponent } from '../../../core/shared/modal/feedback/feedback.component';

@Component({
  selector: 'app-quiz-creation',
  standalone: true,
  imports: [
    MatIconModule,
    QuestionListItemComponent,
    CommonModule,
    AnswerComponent,
    ReactiveFormsModule,
    FormsModule,
    FeedbackComponent,
  ],
  templateUrl: './quiz-creation.component.html',
  styleUrl: './quiz-creation.component.scss',
})
export class QuizCreationComponent {
  quizForm: FormGroup;
  selectedQuestionIndex: number | null = null;
  quizTitle: string = '';
  showErrors: boolean = false;

  feedbackVisible: boolean = false;
  feedbackTitle: string = '';
  feedbackMessage: string = '';
  feedbackImageSrc: string = '';

  showFeedback(title: string, message: string, imageSrc: string) {
    this.feedbackTitle = title;
    this.feedbackMessage = message;
    this.feedbackImageSrc = imageSrc;
    this.feedbackVisible = true;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private quizDataService: QuizDataService,
    private assessmentService: AssessmentService
  ) {
    this.quizForm = this.fb.group({
      questions: this.fb.array([]),
      timeFrame: [10, Validators.required],
    });
    this.addQuestion();
    this.loadQuizData();
    this.loadQuizTitle();
  }

  get questions(): FormArray<FormGroup> {
    return this.quizForm.get('questions') as FormArray<FormGroup>;
  }

  get answers(): FormArray {
    const selectedQuestion = this.questions.at(
      this.selectedQuestionIndex!
    ) as FormGroup;
    return selectedQuestion && selectedQuestion.get('answers')
      ? (selectedQuestion.get('answers') as FormArray)
      : new FormArray<any>([]);
  }

  addQuestion() {
    const questionGroup = this.fb.group({
      text: ['', Validators.required],
      answers: this.fb.array([], Validators.required),
      timestamp: new Date().toISOString(),
      marks: [0, Validators.required],
    });
    this.questions.push(questionGroup);
    this.selectedQuestionIndex = this.questions.length - 1;
  }

  selectQuestion(index: number) {
    this.selectedQuestionIndex = index;
  }

  addAnswer(questionIndex: number) {
    const answers = (this.questions.at(questionIndex) as FormGroup).get(
      'answers'
    ) as FormArray;
    answers.push(this.fb.group({ text: '', isCorrect: false }));
  }

  updateAnswer(questionIndex: number, answerIndex: number, value: string) {
    const answers = (this.questions.at(questionIndex) as FormGroup).get(
      'answers'
    ) as FormArray;
    answers.at(answerIndex).get('text')?.setValue(value);
  }

  toggleCorrectAnswer(questionIndex: number, answerIndex: number) {
    const answers = (this.questions.at(questionIndex) as FormGroup).get(
      'answers'
    ) as FormArray;
    answers.controls.forEach((answer, i) => {
      answer.get('isCorrect')?.setValue(i === answerIndex);
    });
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    const answers = (this.questions.at(questionIndex) as FormGroup).get(
      'answers'
    ) as FormArray;
    answers.removeAt(answerIndex);
  }

  getOption(index: number): string {
    return String.fromCharCode(65 + index);
  }

  submitQuiz() {
    this.showErrors = true;

    if (this.quizForm.invalid) {
      return;
    }

    const quizData = this.quizForm.value.questions.map((question: any) => ({
      text: question.text,
      answers: question.answers.map((answer: any) => ({
        text: answer.text,
        isCorrect: answer.isCorrect,
      })),
      mark: question.marks,
    }));

    this.assessmentService
      .addAssessment(quizData, this.quizForm.value.timeFrame)
      .subscribe({
        next: (response) => {
          this.showFeedback(
            `Quiz Saved Successfully`,
            `Your Quiz assignment has been successfully created. You can now proceed to assign it to the relevant trainees or cohorts when ready!`,
            'assets/Images/svg/add-spec.svg'
          );
          localStorage.removeItem('quizData');
        },
        error: (err) => {
          console.error('Error submitting quiz', err);
          this.showFeedback(
            `Failed to Saved Quiz`,
            `Quiz failed to save. Please try again later`,
            'assets/Images/svg/add-spec.svg'
          );
        },
      });
  }

  saveQuizData() {
    const quizData = this.quizForm.value;
    localStorage.setItem('quizData', JSON.stringify(quizData));
  }

  loadQuizData() {
    const savedQuizData = localStorage.getItem('quizData');
    if (savedQuizData) {
      const quizData = JSON.parse(savedQuizData);
      if (quizData.questions) {
        const questionsArray = this.fb.array(
          quizData.questions.map((question: any) =>
            this.fb.group({
              text: question.text,
              answers: this.fb.array(
                question.answers.map((answer: any) =>
                  this.fb.group({
                    text: answer.text,
                    isCorrect: answer.isCorrect,
                  })
                )
              ),
              timestamp: question.timestamp,
              marks: question.marks,
            })
          )
        );
        this.quizForm.setControl('questions', questionsArray);
      }
    }
  }

  loadQuizTitle() {
    this.quizDataService.getQuizData().subscribe((assessmentFormData) => {
      if (assessmentFormData && assessmentFormData.quizzes) {
        this.quizTitle = assessmentFormData.quizzes
          .map((quiz: Quiz) => quiz.title)
          .join(', ');
      }
    });
  }

  onCloseFeedback() {
    this.feedbackVisible = false;
    this.router.navigate(['/home/trainer/assessment']);
  }

  save() {
    this.saveQuizData();
  }

  isSubmitDisabled(): boolean {
    return this.quizForm.invalid || this.questions.controls.some(q => q.get('marks')?.value === 0);
  }
}
