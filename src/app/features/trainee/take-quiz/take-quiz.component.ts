import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizSubmission } from '@core/models/trainee.interface';
import { QuizService } from '@core/services/trainee/quiz-questions/quiz.service';
import { Observable, map, first, combineLatest } from 'rxjs';

interface QuizQuestion {
  id: number;
  text: string;
  answersDTO: { id: number; text: string }[];
}

@Component({
  selector: 'app-take-quiz',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, JsonPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './take-quiz.component.html',
  styleUrl: './take-quiz.component.scss'
})
export class TakeQuizComponent implements OnInit {
  currentQuestionIndex = 0;
  currentQuestion$!: Observable<QuizQuestion>;
  quizQuestions$!: Observable<QuizQuestion[]>;
  selectedAnswerId: number | null = null;
  quizForm: FormGroup;
  totalQuestionCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public quizService: QuizService,
    private fb: FormBuilder
  ) {
    this.quizForm = this.fb.group({
      traineeEmail: [''],
      submittedAnswers: this.fb.array([]),
    })
  }

  ngOnInit() {
    // Fetch all quiz questions
    this.quizQuestions$ = this.quizService.getQuizQuestionsById();

    // Create an observable for the current question
    this.currentQuestion$ = this.quizQuestions$.pipe(
      map(questions => {
        this.totalQuestionCount = questions.length;
        return questions[this.currentQuestionIndex];
      })
    );
  }

  get submittedAnswers(): FormArray {
    return this.quizForm.get('submittedAnswers') as FormArray;
  }

  addAnswer(questionId: number, selectedAnswerId: number): void {
    const answerIndex = this.submittedAnswers.value.findIndex(
      (a: any) => a.questionId === questionId
    );

    if(answerIndex > -1) {
      this.submittedAnswers.at(answerIndex).patchValue({ selectedAnswerId });
    } else {
      this.submittedAnswers.push(
        this.fb.group({ questionId, selectedAnswerId})
      )
    }
  }

  submitQuiz() {
    const quizSubmission: QuizSubmission = this.quizForm.value;
    console.log('Quiz Submission', quizSubmission);
  }

  checkSelectedAnswer(id: number) {
    this.selectedAnswerId = id;
  }

  isAnswerSelected(id: number): boolean {
    return this.selectedAnswerId === id;
  }

  goBack() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedAnswerId = null;
      this.currentQuestion$ = this.quizQuestions$.pipe(
        map(questions => questions[this.currentQuestionIndex])
      );
    }
  }

  next() {
    // Ensure an answer is selected 
    if (this.selectedAnswerId !== null) {
      // Add the current question's answer
      this.currentQuestion$.pipe(
        first()
      ).subscribe(currentQuestion => {
        this.addAnswer(
          currentQuestion.id, 
          this.selectedAnswerId!
        );

        // Move to next question or submit if it's the last question
        if (this.currentQuestionIndex < this.totalQuestionCount - 1) {
          this.currentQuestionIndex++;
          this.selectedAnswerId = null;
          this.currentQuestion$ = this.quizQuestions$.pipe(
            map(questions => questions[this.currentQuestionIndex])
          );
        } else {
          this.submit();
        }
      });
    } else {
      // Prevent moving without selecting an answer
      alert('Please select an answer before proceeding');
    }
  }

  submit() {
    this.submitQuiz();
    this.router.navigate(['/home/trainee/assessments/feedback'])
  }

  // Helper method to check if it's the last question
  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.totalQuestionCount - 1;
  }
}