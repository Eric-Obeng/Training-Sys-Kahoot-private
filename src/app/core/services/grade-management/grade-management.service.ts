import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AssessmentList } from '@core/models/grade-management.interface';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GradeManagementService {

  public selectedAssessmentTitle: string = '';


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
    return this.http.get<any[]>(`${this.grademanagementUrl}/grades/history`, { headers: this.getHeaders() }).pipe(
      // map((res:any) => {
      //   const response = res.content;
      //   return response;
      // })
    )
  }

  getGradedTraineesList() {
    return this.http.post<any[]>(`${this.grademanagementUrl}/assessments/submitted`, 
    {
      "title": this.selectedAssessmentTitle,
      "graded": true,
    },
    { headers: this.getHeaders() })
  }
  

  getUngradedTraineesList() {
    return this.http.post<any[]>(`${this.grademanagementUrl}/assessments/submitted`, 
    {
      "title": this.selectedAssessmentTitle,
      "graded": false,
    },
    { headers: this.getHeaders() })
  }
}
