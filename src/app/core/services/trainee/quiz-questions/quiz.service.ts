import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private quizesUrl = 'http://localhost:9000/quizes';
  questionId = 1; 
  quizId = '';

  constructor(
    private http: HttpClient
  ) { }


  // Fetch quiz title
  getQuizTitle(): Observable<string | null> {
    return this.http.get<any[]>(this.quizesUrl).pipe(
      map((response) => {
        const quiz = response.find((quiz) => quiz.id === this.quizId);
        return quiz ? quiz.quizTitle : null;
      })
    );
  }

  // Fetch quiz details
  getQuizDetails(): Observable<any | null> {
    return this.http.get<any[]>(this.quizesUrl).pipe(
      map((response) => {
        const quiz = response.find((quiz) => quiz.id === this.quizId);
        return quiz ? quiz.quizDetails : null;
      })
    );
  }


  // Fetch questions for a specific quiz by ID
  getQuestionById(): Observable<any> {
    return this.http.get<any[]>(this.quizesUrl).pipe(
      map((response) => {
        const quiz = response.find((quiz) => quiz.id === this.quizId);
        return quiz?.questions.find((question: { id: number }) => question.id === this.questionId) || null;
      })
    );
  }


}
