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
  ],
  templateUrl: './quiz-creation.component.html',
  styleUrl: './quiz-creation.component.scss',
})
export class QuizCreationComponent {
  quizForm: FormGroup;
  selectedQuestionIndex: number | null = null;
  quizTitle: string = '';
  showErrors: boolean = false;

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

    console.log('submitting');
    const quizData = this.quizForm.value.questions.map(
      (question: any, index: number) => ({
        questionNumber: index + 1,
        questionText: question.text,
        updatedTime: question.timestamp,
        options: question.answers.map((answer: any, i: number) => ({
          option: this.getOption(i),
          value: answer.text,
          isCorrect: answer.isCorrect,
        })),
        marks: question.marks,
      })
    );

    this.quizDataService.getQuizData().subscribe((assessmentFormData) => {
      if (assessmentFormData) {
        const combinedData = {
          ...assessmentFormData,
          questions: quizData,
          timeFrame: this.quizForm.value.timeFrame, 
        };

        const assessmentFormComponent = new AssessmentFormComponent(
          this.fb,
          this.route,
          this.router,
          this.quizDataService,
          this.assessmentService
        );
        assessmentFormComponent.submitQuizWithQuestions(quizData);

        console.log(combinedData);

        // Remove quiz data from local storage after submission
        localStorage.removeItem('quizData');
      }
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
      if (assessmentFormData) {
        this.quizTitle = assessmentFormData.title;
      }
    });
  }

  save() {
    this.saveQuizData();
  }
}
