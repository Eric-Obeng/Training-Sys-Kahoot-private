import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assignment, QuizSubmission } from '@core/models/trainee.interface';
import { TokenService } from '@core/services/token/token.service';
import { UserRoleService } from '@core/services/user-role/user-role.service';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private quizesUrl = environment.BaseUrl;
  questionId = 1; 
  public quizId: string | null = null; 
  public selectedAssessment$: Observable<Assignment | null> = of(null); 

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  // Fetch questions for a specific quiz by ID
  getQuizQuestionsById(): Observable<any> {
    if (this.quizId === null) {
      this.getQuizIdAndAssessmentFromLocalStorage();
    }
    return this.http.get<any[]>(`${this.quizesUrl}/quizzes/all/${this.quizId}/questions`);
  }

  // Retrieve quiz ID and assessment from localStorage
  getQuizIdAndAssessmentFromLocalStorage(): void {
    const quizId = localStorage.getItem('quizId');
    const assessment = localStorage.getItem('assessment');

    if (quizId) {
      this.quizId = quizId; 
    } else {
      console.warn('quizId not found in localStorage');
    }

    if (assessment) {
      try {
        this.selectedAssessment$ = of(JSON.parse(assessment) as Assignment);
      } catch (error) {
        console.error('Error parsing assessment from localStorage:', error);
      }
    } else {
      console.warn('assessment not found in localStorage');
    }
  }

  submitQuiz(quizSubmission: QuizSubmission) {
    // const quizSubmissionObject = 
    // console.log("object: ", quizSubmissionObject)
    return this.http.post<QuizSubmission[]>(`${this.quizesUrl}/quiz-submissions/trainee/${this.quizId}`, {...quizSubmission, traineeEmail: this.tokenService.getDecodedTokenValue()?.email} ); 
  }
}
