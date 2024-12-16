import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '@core/services/trainee/quiz-questions/quiz.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-take-quiz',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, JsonPipe],
  templateUrl: './take-quiz.component.html',
  styleUrl: './take-quiz.component.scss'
})
export class TakeQuizComponent implements OnInit {

  currentQuizTitle$!: Observable<any>;
  currentQuizDetails$!: Observable<any>;
  currentQuestion$!: Observable<any>;

  quizQuestions$!: Observable<any>;
  selectedAnswerId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public quizService: QuizService,
  ) {}

  ngOnInit() {
    // this.currentQuizTitle$ = this.quizService.getQuizTitle();
    // this.currentQuizDetails$ = this.quizService.getQuizDetails();
    // this.currentQuestion$ = this.quizService.getQuestionById();
    this.quizQuestions$ = this.quizService.getQuizQuestionsById();
    this.quizQuestions$.subscribe(data => console.log("res: ", data))

    this.quizService.selectedAssessment$.subscribe(data => console.log("assess res: ", data))
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
    this.quizService.questionId = this.quizService.questionId + 1;
    // this.currentQuestion$ = this.quizService.getQuestionById();
  }

  submit() {
    this.router.navigate(['/home/trainee/assessments/feedback'])
  }


}
