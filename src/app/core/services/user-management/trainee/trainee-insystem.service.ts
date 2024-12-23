import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, first, map, of, tap, throwError } from 'rxjs';
import { User } from '../../../models/cohort.interface';
import { environment } from 'src/environments/environment.development';
import { TraineeList } from '@core/models/trainee.interface';
import { ErrorHandleService } from '@core/services/error-handle/error-handle.service';


@Injectable({
  providedIn: 'root',
})
export class TraineeInsystemService {
  private baseUrl: string = environment.BaseUrl;

  public retreivedUserDataSubject = new BehaviorSubject<User | null>(null);
  public retreivedUserData$: Observable<User | null> =
    this.retreivedUserDataSubject.asObservable();
  public userDataRetrieved: boolean = false;

  public finalFormStateSubject = new BehaviorSubject<User | null>(null);
  public finalFormState$: Observable<User | null> =
    this.finalFormStateSubject.asObservable();
  // public finalFormData!: User | null;

  private firstFormStateSubject = new BehaviorSubject<User | null>(null);
  public firstFormState$: Observable<User | null> =
    this.firstFormStateSubject.asObservable();

  private secondFormStateSubject = new BehaviorSubject<User | null>(null);
  public secondFormState$: Observable<User | null> =
    this.secondFormStateSubject.asObservable();

  private allTraineesSubject = new BehaviorSubject<User[] | null>(null);
  public allTrainees$: Observable<User[] | null> =
    this.allTraineesSubject.asObservable();

  private selectedTraineesSubject = new BehaviorSubject<User | null>(null);
  public selectedTrainee$: Observable<User | null> =
    this.selectedTraineesSubject.asObservable();

  deleteModalSuccessful!: boolean;

  public selectedEmailSubject = new BehaviorSubject<string | null>('');
  public selectedEmail$: Observable<string | null> = this.selectedEmailSubject.asObservable();

  public selectedTraineeId: number = 0;
  emailAsyncValidatoryResponseObtained!: boolean;
  emailAsyncReturnedEmail!: string;


  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandleService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      "ngrok-skip-browser-warning": "69420"
    });
  }


  checkEmail(email: string): Observable<User | null> {
    return this.http.post<User>(`${this.baseUrl}/profiles/trainees/find`, { email }, {
      headers: this.getHeaders(),
    }).pipe(
      first(),
      tap(response => {
        // Only update if the response is different from the current value
        if (response !== this.retreivedUserDataSubject.getValue()) {
          this.retreivedUserDataSubject.next(response || null);
        }
      }),
      catchError(error => {
        console.error('Error in checkEmail:', error);
        // Only update if not already null
        if (this.retreivedUserDataSubject.getValue() !== null) {
          this.retreivedUserDataSubject.next(null);
        }
        return of(null);
      })
    );
  }




  setFinalFormState(data: User) {
    this.finalFormStateSubject.next(data);
  }

  setFirstFormState(data: User | null) {
    this.firstFormStateSubject.next(data);
  }

  setSecondFormState(data: User | null) {
    this.secondFormStateSubject.next(data);
  }

  //Usermanagment add user requests
  //Put request to backend
  updateUserData(updateFormData: {}, email: string | undefined) {
    return this.http
      .put<User>(
        `${this.baseUrl}?email=${encodeURIComponent(email || '')}`,
        updateFormData
      )
      .pipe(
        tap(() => {
          this.firstFormStateSubject.next(null);
          this.secondFormStateSubject.next(null);
        }),
        catchError((error) => this.errorHandlerService.handleError(error))
      );
  }

  createNewUser(formData: FormData) {
    return this.http.post<User>(`${this.baseUrl}/users/trainee/create`, formData).pipe(
      tap(() => {
        // Reset form states
        this.firstFormStateSubject.next(null);
        this.secondFormStateSubject.next(null);
      }),
      catchError((error) => {
        return throwError(() => this.errorHandlerService.handleError(error));
      })
    );
  }


  updateExistingUser(formData: FormData) {
    return this.http.put<User>(`${this.baseUrl}/profiles/trainees/${this.selectedTraineeId}`, formData).pipe(
      tap(() => {
        // Reset form states
        this.firstFormStateSubject.next(null);
        this.secondFormStateSubject.next(null);
      }),
      catchError((error) => {
        return throwError(() => this.errorHandlerService.handleError(error));
      })
    );
  }

  // Get all trainees
  getAllTrainees() {
    return this.http.get<TraineeList>(`${this.baseUrl}/profiles/trainees`, { headers: this.getHeaders() }).pipe(
      map(res => {
        const trainees = res.content;
        return trainees;
      }),
      tap((trainees) => {
        this.allTraineesSubject.next(trainees)
      }),
      catchError(error => this.errorHandlerService.handleError(error))
    )
  }

  getSelectedTrainee(trainee: User) {
    this.selectedTraineesSubject.next(trainee);
  }

  deleteSelectedTrainee(email: string) {
    return this.http.post<User>(`${this.baseUrl}/profiles/trainees/status`, { "email": email }).pipe(
      tap((response) => {
        this.deleteModalSuccessful = true;
        console.log('Delete Response:', response);
      }),
      catchError((error) => this.errorHandlerService.handleError(error))
    );
  }
}
