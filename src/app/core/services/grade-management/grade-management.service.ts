import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { tap } from 'rxjs';

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
  grademanagementUrl: string = "https://0238-196-61-35-158.ngrok-free.app/api/v1/";

  constructor(
    private http: HttpClient
  ) { }

  getAllAssessments() {
    return this.http.get<any>(`${this.grademanagementUrl}/assessments/graded`, { headers: this.getHeaders()})
  }
}
