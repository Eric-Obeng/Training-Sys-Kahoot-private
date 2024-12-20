import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  retry,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

import { ErrorHandleService } from '@core/services/error-handle/error-handle.service';
import { Trainer, TrainerList } from '@core/models/trainer.interface';
import { cachingInterceptor } from '@core/interceptors/caching.interceptor';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  private allTrainersSubject = new BehaviorSubject<Trainer[] | null>(null);
  public allTrainees$: Observable<Trainer[] | null> =
    this.allTrainersSubject.asObservable();

  private selectedTrainerSubject = new BehaviorSubject<Trainer | null>(null);
  public selectedTrainer$: Observable<Trainer | null> =
    this.selectedTrainerSubject.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandleService
  ) {}

  trainerCreation(formData: FormData): Observable<Trainer> {
    const headers = new HttpHeaders({
      'cross-roads': 'ADMIN',
    });
    return this.http
      .post<Trainer>(`${environment.BaseUrl}/users/trainer/create`, formData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }

  getAllTrainers(): Observable<Trainer[]> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': '69420',
    });

    return this.http
      .get<TrainerList>(`${environment.BaseUrl}/profiles/trainers`, { headers })
      .pipe(
        retry(2),
        map((response) => response.content),
        tap((trainers) => {
          this.allTrainersSubject.next(trainers);
        }),
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }

  getTrainerByEmail(email: string): Observable<Trainer> {
    return this.http
      .get<Trainer>(`${environment.BaseUrl}/profiles/trainers/${email}`)
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }

  updateTrainer(id: string, formData: FormData): Observable<any> {
    return this.http
      .put<any>(`${environment.BaseUrl}/profiles/trainers/${id}`, formData)
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }

  setSelectedTrainer(trainer: Trainer | null): void {
    this.selectedTrainerSubject.next(trainer);
  }
}

