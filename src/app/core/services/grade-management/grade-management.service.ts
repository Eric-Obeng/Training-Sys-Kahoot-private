import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AssessmentList } from '@core/models/grade-management.interface';

@Injectable({
  providedIn: 'root'
})
export class GradeManagementService {

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      "ngrok-skip-browser-warning": "69420"
    });
  }


  // grademanagementUrl: string = environment.BaseUrl;
  grademanagementUrl: string = "https://e411-196-61-35-158.ngrok-free.app/api/v1";

  constructor(
    private http: HttpClient
  ) { }

  getGradedAssessments() {
    return this.http.get<AssessmentList[]>(`${this.grademanagementUrl}/assessments/graded`, { headers: this.getHeaders()})
  }

  getUngradedAssessments() {
    return this.http.get<AssessmentList[]>(`${this.grademanagementUrl}/assessments/ungraded`, { headers: this.getHeaders()})
  }
}
