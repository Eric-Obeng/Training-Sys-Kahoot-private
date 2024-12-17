import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AssessmentDetails, AssessmentList, AssessmentOverview, TraineeGradeHistory, gradedTraineeList, ungradedTraineeList } from '@core/models/grade-management.interface';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GradeManagementService {

  public selectedAssessmentTitle: string | null = '';
  public selectedTraineeEmail: string = '';


  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      "ngrok-skip-browser-warning": "69420"
    });
  }

  grademanagementUrl: string = environment.BaseUrl;

  constructor(
    private http: HttpClient
  ) { }

  getGradedAssessments() {
    return this.http.get<AssessmentList[]>(`${this.grademanagementUrl}/assessments/graded`, { headers: this.getHeaders()})
  }

  getUngradedAssessments() {
    return this.http.get<AssessmentList[]>(`${this.grademanagementUrl}/assessments/ungraded`, { headers: this.getHeaders()})
  }

  getGradeHistoryList() {
    return this.http.get<TraineeGradeHistory[]>(`${this.grademanagementUrl}/grades/history`, { headers: this.getHeaders() }).pipe(
      // map((res:any) => {
      //   const response = res.content;
      //   return response;
      // })
    )
  }

  getSingleTraineeGradeHistory() {
    return this.http.post<AssessmentOverview[]>(`${this.grademanagementUrl}/grades/history`, {"email": this.selectedTraineeEmail}, { headers: this.getHeaders() })
  }

  getGradedTraineesList() {
    return this.http.post<gradedTraineeList[]>(`${this.grademanagementUrl}/assessments/submitted`, 
    {
      "title": this.selectedAssessmentTitle,
      "graded": true,
    },
    { headers: this.getHeaders() })
  }
  

  getUngradedTraineesList() {
    return this.http.post<ungradedTraineeList[]>(`${this.grademanagementUrl}/assessments/submitted`, 
    {
      "title": this.selectedAssessmentTitle,
      "graded": false,
    },
    { headers: this.getHeaders() })
  }

  getAssessmentDetailsForGrading() {
    return this.http.post<AssessmentDetails>(`${this.grademanagementUrl}/assessments/get-assessment`, {
      "assessmentTitle": this.selectedAssessmentTitle,
      "traineeEmail": this.selectedTraineeEmail,
    }, { headers: this.getHeaders() })
  }

  submitGradedAssessment(score: number) {
    return this.http.post<AssessmentDetails>(`${this.grademanagementUrl}/assessments/grade`, {
      "assessmentTitle": this.selectedAssessmentTitle,
      "traineeEmail": this.selectedTraineeEmail,
      "grade": score,
    }, { headers: this.getHeaders() })
  }

}
