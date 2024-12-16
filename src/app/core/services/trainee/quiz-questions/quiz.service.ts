import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assignment } from '@core/models/trainee.interface';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private quizesUrl = environment.BaseUrl;
  questionId = 1; 
  public quizId: number = 0;
  public selectedAssessment$!: Observable<Assignment>;

  constructor(
    private http: HttpClient
  ) { }


  // // Fetch quiz title
  // getQuizTitle(): Observable<string | null> {
  //   return this.http.get<any[]>(this.quizesUrl).pipe(
  //     map((response) => {
  //       const quiz = response.find((quiz) => quiz.id === this.quizId);
  //       return quiz ? quiz.quizTitle : null;
  //     })
  //   );
  // }

  // // Fetch quiz details
  // getQuizDetails(): Observable<any | null> {
  //   return this.http.get<any[]>(this.quizesUrl).pipe(
  //     map((response) => {
  //       const quiz = response.find((quiz) => quiz.id === this.quizId);
  //       return quiz ? quiz.quizDetails : null;
  //     })
  //   );
  // }


  // // Fetch questions for a specific quiz by ID
  // getQuestionById(): Observable<any> {
  //   return this.http.get<any[]>(this.quizesUrl).pipe(
  //     map((response) => {
  //       const quiz = response.find((quiz) => quiz.id === this.quizId);
  //       return quiz?.questions.find((question: { id: number }) => question.id === this.questionId) || null;
  //     })
  //   );
  // }

  // Fetch questions for a specific quiz by ID
  getQuizQuestionsById(): Observable<any> {
    return this.http.get<any[]>(`${this.quizesUrl}/quizzes/all/${this.quizId}/questions`)
  }




}
