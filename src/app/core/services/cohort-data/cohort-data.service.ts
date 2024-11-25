import { Injectable } from '@angular/core';
import { Cohort, CohortDetails, CohortList, Specialization } from '../../models/cohort.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { ErrorHandlerService } from './error-handling/error-handler.service';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CohortDataService {

  private cohortsListUrl: string = `${environment.BaseUrl}/cohorts`;

  selectedCohortId: string = "1";
  selectedCohortForUpdate: string = "";

  private cohortFormDataSubject = new BehaviorSubject<Cohort | null>(null);
  createCohortFormData$ : Observable<Cohort | null> = this.cohortFormDataSubject.asObservable();

  private cohortDetailsSubject = new BehaviorSubject<CohortDetails[] | null>(null);
  cohortDetails$ : Observable<CohortDetails[] | null> = this.cohortDetailsSubject.asObservable();

  constructor(
    private http: HttpClient,
    public errorhandlerService: ErrorHandlerService
    ) { }

  
  //(HTTP Request) Retriev a list of cohorts from backend 
  getAllCohorts(): Observable<CohortList[]> { 
    const headers = new HttpHeaders({
      "ngrok-skip-browser-warning": "69420"
    });
  
    return this.http.get<CohortList[]>(this.cohortsListUrl, { headers }).pipe(
      tap((response: CohortList[]) => {
        // console.log("allcohorts: ", response);
      }),
      catchError(error => this.errorhandlerService.handleError(error))
    );
  }
  


  //(HTTP Request) Make a post request to backend to add cohort
  addCohort(formData: Cohort) {
    console.log("formData", formData)
    const headers = new HttpHeaders({
      "ngrok-skip-browser-warning": "69420"
    });

    return this.http.post<CohortList>(this.cohortsListUrl, formData, { headers }).pipe(
      catchError(error => this.errorhandlerService.handleError(error))
    )
  }

  //(HTTP Request) Make a post request to backend for Cohort Details including trainee list
  getSelectedCohortDetails() {
    const headers = new HttpHeaders({
      "ngrok-skip-browser-warning": "69420"
    });

    return this.http.get<CohortDetails>(`${this.cohortsListUrl}/${this.selectedCohortId}`, { headers }).pipe(
      catchError(error => this.errorhandlerService.handleError(error))
    )
  }

  //(HTTP Request) Get cohort for update
  getCohortFormData(): Observable<Cohort> {
    const headers = new HttpHeaders({
      "ngrok-skip-browser-warning": "69420"
    });
    
    return this.http.get<Cohort>(`${this.cohortsListUrl}/cohorts/${this.selectedCohortId}`).pipe(
      catchError(error => this.errorhandlerService.handleError(error))
    )
  }

  updateCohort(formData: Cohort) {
    console.log("formData: ", formData)
    return this.http.put<Cohort>(`${this.cohortsListUrl}/${this.selectedCohortForUpdate}`, formData).pipe(
      catchError(error => this.errorhandlerService.handleError(error))
    )
  }

  deleteCohort(id: string) {
    const headers = new HttpHeaders({
      "ngrok-skip-browser-warning": "69420"
    });

    return this.http.delete<CohortList>(`${this.cohortsListUrl}/${id}`).pipe(
      catchError(error => this.errorhandlerService.handleError(error))
    )
  }

  // Set data for cohortFormData Behavoir subject
  setCohortFormData(data: Cohort | null) { 
    this.cohortFormDataSubject.next(data);
  }



}
