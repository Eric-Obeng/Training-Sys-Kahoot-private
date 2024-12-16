import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizSubmission } from '@core/models/trainee.interface';
import { QuizService } from '@core/services/trainee/quiz-questions/quiz.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-take-quiz',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, JsonPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './take-quiz.component.html',
  styleUrl: './take-quiz.component.scss'
})
export class TakeQuizComponent implements OnInit {

  currentQuizTitle$!: Observable<any>;
  currentQuizDetails$!: Observable<any>;
  currentQuestion$!: Observable<any>;

  quizQuestions$!: Observable<any>;
  selectedAnswerId: number | null = null;

  quizForm: FormGroup;

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
    // this.currentQuizTitle$ = this.quizService.getQuizTitle();
    // this.currentQuizDetails$ = this.quizService.getQuizDetails();
    // this.currentQuestion$ = this.quizService.getQuestionById();
    this.quizQuestions$ = this.quizService.getQuizQuestionsById();
    this.quizQuestions$.subscribe(data => console.log("res: ", data))

    this.quizService.selectedAssessment$.subscribe(data => console.log("assess res: ", data))
  }

  get submittedAnswers(): FormArray {
    return this.quizForm.get('submittedAnswers') as FormArray;
  }

  addAnswer(questionId: number, selectedAnswerId:number): void {
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
    console.log('Quiz Submission', quizSubmission)
  }


  checkSelectedAnswer(id: number) {
    this.selectedAnswerId = id;
  }



  isAnswerSelected(id: number): boolean {
    return this.selectedAnswerId === id;
  }

  goBack() {
    this.quizService.questionId = this.quizService.questionId - 1;
    // this.currentQuestion$ = this.quizService.getQuestionById();
  }

  next() {
    this.submitQuiz()
    // this.quizService.questionId = this.quizService.questionId + 1;
    // this.currentQuestion$ = this.quizService.getQuestionById();
  }

  submit() {
    this.router.navigate(['/home/trainee/assessments/feedback'])
  }


}
