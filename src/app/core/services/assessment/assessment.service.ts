import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { cachingInterceptor } from '@core/interceptors/caching.interceptor';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private getAsessmentTypeUrl = 'assets/data/assessmentType.json';
  private assessmentsSubject = new BehaviorSubject<AssessmentData[]>([]);
  assessments$ = this.assessmentsSubject.asObservable();

  constructor(private http: HttpClient) {}

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
          this.assessmentsSubject.next(data);
        }),
        catchError((error) => {
          console.error('Error fetching assessments:', error);
          return throwError(() => error);
        })
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
        `${environment.BaseUrl}/quizzes/trainer/${quizId}/questions/batch?quizDuration=${timeFrame}`,
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
  createLabOrPresentation(
    data: FormData,
    type: 'lab' | 'presentation'
  ): Observable<Lab> {
    const url =
      type === 'presentation'
        ? `${environment.BaseUrl}/assessments/presentation`
        : `${environment.BaseUrl}/assessments/lab`;
    return this.http.post<Lab>(url, data);
  }

  assignAssessment(data: AssignAssessment) {
    return this.http.post(`${environment.BaseUrl}/assignments/batch`, data, {
      responseType: 'text',
    });
  }

  assignAssessmentToCohort(
    assessmentId: number,
    cohortId: number,
    deadline: string
  ) {
    const params = {
      assessmentId: assessmentId.toString(),
      cohortId: cohortId.toString(),
      deadline: deadline,
    };
    return this.http.post(`${environment.BaseUrl}/assignments/cohort`, null, {
      params,
      responseType: 'text',
    });
  }
}
