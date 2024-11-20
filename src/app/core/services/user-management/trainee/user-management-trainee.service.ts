import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cohort, Specialization } from '../../../models/cohort.interface';
import { ErrorHandlerService } from '../../cohort-data/error-handling/error-handler.service';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserManagementTraineeService {

  private allspecializations = `${environment.BaseUrl}/specializations`;
  private allcohorts = `${environment.BaseUrl}/cohorts/assignable`;
  // private allcohorts = "http://localhost:9000/allCohorts";

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      "ngrok-skip-browser-warning": "69420"
    });
  }

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
  ) { }

  getAllspecializations() {    
    return this.http.get<Specialization[]>(this.allspecializations, { headers: this.getHeaders() }).pipe(
      catchError(error => this.errorHandlerService.handleError(error))
    )
  }

  getAllCohorts() {
    return this.http.get<Cohort[]>(this.allcohorts , { headers: this.getHeaders() }).pipe(
      catchError(error => this.errorHandlerService.handleError(error))
    )
  }
}
