import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  retry,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { ErrorHandleService } from '@core/services/error-handle/error-handle.service';
import { Trainer } from '@core/models/trainer.interface';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  private allTrainersSubject = new BehaviorSubject<Trainer[] | null>(null);
  public allTrainees$: Observable<Trainer[] | null> =
    this.allTrainersSubject.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandleService
  ) {}

  trainerCreation(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'cross-roads': 'ADMIN',
    });
    return this.http
      .post<any>(`${environment.BaseUrl}/users/trainer/create`, formData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }

  getAllTrainers() {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': '69420',
    })
    return this.http
      .get<Trainer[]>(`${environment.BaseUrl}/users/role`, {
        params: { role: 'TRAINER' },headers
      })
      .pipe(
        retry(2),
        tap((response) => {
          this.allTrainersSubject.next(response);
        }),
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }
}
