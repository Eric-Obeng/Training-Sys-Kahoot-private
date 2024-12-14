import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  catchError,
  Observable,
  retry,
  tap,
  throwError,
  BehaviorSubject,
  map,
} from 'rxjs';
import {
  AssessmentData,
  AssessmentType,
  AssignAssessment,
  CreateAssessment,
  Lab,
  Quiz,
} from '@core/models/assessment-form.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private getAsessmentTypeUrl = 'assets/data/assessmentType.json';
  private assessmentsSubject = new BehaviorSubject<AssessmentData[]>([]);
  assessments$ = this.assessmentsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Ensure no redundant calls to loadAssessments
  }

  private loadAssessments() {
    this.getAssessments().subscribe((data) => {
      console.log('Assessments loaded in service:', data);
    });
  }

  getAssessmentType() {
    return this.http.get<CreateAssessment[]>(this.getAsessmentTypeUrl);
  }

  // Get all assessments without filtering
  getAssessments(): Observable<AssessmentData[]> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': '45678',
    });
    return this.http
      .get<AssessmentData>(`${environment.BaseUrl}/assessments/all`, {
        headers,
      })
      .pipe(
        tap((response) => {
          console.log('API response:', response);
        }),
        map((response: AssessmentData) => {
          const assessments: AssessmentData[] = [
            {
              quizzes: response.quizzes,
              labs: response.labs,
              presentations: response.presentations,
            },
          ];
          return assessments;
        }),
        tap((data) => {
          console.log('Assessments fetched successfully:', data);
          this.assessmentsSubject.next(data);
        }),
        catchError((error) => {
          console.error('Error fetching assessments:', error);
          return throwError(() => error);
        }),
      );
  }

  // Add a new assessment
  addAssessment(
    assessment: Quiz,
    timeFrame: number
  ): Observable<AssessmentData> {
    const quizId = JSON.parse(localStorage.getItem('quizId') || 'null');
    if (!quizId) {
      throw new Error('Quiz ID not found in local storage');
    }
    return this.http
      .post<AssessmentData>(
        `${environment.BaseUrl}/quizzes/${quizId}/questions/batch?quizDuration=${timeFrame}`,
        assessment,
        { responseType: 'text' as 'json' }
      )
      .pipe(
        catchError((error) => {
          console.error('Error adding assessment:', error);
          return throwError(() => error);
        })
      );
  }

  // create lab or presentation
  createLabOrPresentation(data: FormData, type: 'lab' | 'presentation'): Observable<Lab> {
    const url = type === 'presentation' ? `${environment.BaseUrl}/assessments/presentation` : `${environment.BaseUrl}/assessments/lab`;
    return this.http.post<Lab>(url, data);
  }

  assignAssessment(data: AssignAssessment) {
    return this.http.post(`${environment.BaseUrl}/assignments/batch`, data, {responseType: 'text'});
  }
}
