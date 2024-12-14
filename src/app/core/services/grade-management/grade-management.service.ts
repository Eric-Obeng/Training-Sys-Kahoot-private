import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AssessmentList } from '@core/models/grade-management.interface';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GradeManagementService {


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
    return this.http.get<any[]>(`${this.grademanagementUrl}//grades/history`, { headers: this.getHeaders() }).pipe(
      map((res:any) => {
        const response = res.content;
        return response;
      })
    )
  }

  getGradedTraineesList(title: string) {
    const params = new HttpParams().set('title', title); // Add query parameter
  
    return this.http.post<any[]>(`${this.grademanagementUrl}/assessments/submitted`, {
      params, // Attach the query parameters
      headers: this.getHeaders(), // Attach headers
    });
  }
  

  getUngradedTraineesList(title: string) {
    const params = new HttpParams().set('title', title);
    return this.http.post<any[]>(`${this.grademanagementUrl}/assessments/submitted`, { params, headers: this.getHeaders() })
  }
}
