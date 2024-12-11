import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cohort, Gender, Specialization } from '../../../models/cohort.interface';
import { ErrorHandlerService } from '../../cohort-data/error-handling/error-handler.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserManagementTraineeService {
  private endpoints = {
    specializations: `${environment.BaseUrl}/specializations`,
    assignableCohorts: `${environment.BaseUrl}/cohorts/assignable`,
    restCountries: 'https://api.first.org/data/v1/countries',
  };

  private genders: Gender[] = [
    { sex: 'Male' },
    { sex: 'Female' }
  ];

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'ngrok-skip-browser-warning': '69420',
    });
  }

  getAllspecializations(): Observable<Specialization[]> {
    return this.http.get<Specialization[]>(this.endpoints.specializations, { headers: this.getHeaders() }).pipe(
      catchError((error) => this.errorHandlerService.handleError(error))
    );
  }

  getAllCohorts(): Observable<Cohort[]> {
    return this.http.get<Cohort[]>(this.endpoints.assignableCohorts, { headers: this.getHeaders() }).pipe(
      catchError((error) => this.errorHandlerService.handleError(error))
    );
  }

  getAllCountries(): Observable<any> {
    return this.http.get<any>(this.endpoints.restCountries);
  }

  getAllGenders(): Observable<Gender[]> {
    return of(this.genders);
  }


}
