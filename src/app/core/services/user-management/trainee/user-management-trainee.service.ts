import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Cohort,
  CohortDetails,
  Gender,
  Specialization,
} from '../../../models/cohort.interface';
import { ErrorHandlerService } from '../../cohort-data/error-handling/error-handler.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment.development';
import { CountryService } from '../country/country.service';
import * as ct from 'countries-and-timezones';

@Injectable({
  providedIn: 'root',
})
export class UserManagementTraineeService {
  private endpoints = {
    specializations: `${environment.BaseUrl}/specializations`,
    assignableCohorts: `${environment.BaseUrl}/cohorts/assignable`,
    active: `${environment.BaseUrl}/cohorts/active`,
    // restCountries: 'https://api.first.org/data/v1/countries',
  };

  private genders: Gender[] = [{ sex: 'male' }, { sex: 'female' }];

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private countryService: CountryService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'ngrok-skip-browser-warning': '69420',
    });
  }

  getAllspecializations(): Observable<Specialization[]> {
    return this.http
      .get<Specialization[]>(this.endpoints.specializations, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.errorHandlerService.handleError(error)));
  }

  getAllCohorts(): Observable<Cohort[]> {
    return this.http
      .get<Cohort[]>(this.endpoints.assignableCohorts, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.errorHandlerService.handleError(error)));
  }

  getAllActiveCohorts(): Observable<CohortDetails[]> {
    return this.http
      .get<CohortDetails[]>(this.endpoints.active, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.errorHandlerService.handleError(error)));
  }

  getAllCountries(): Observable<any> {
    const countries = ct.getAllCountries();
    return of(Object.values(countries));
  }

  getAllGenders(): Observable<Gender[]> {
    return of(this.genders);
  }
}
