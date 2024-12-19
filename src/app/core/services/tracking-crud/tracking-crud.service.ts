import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CohortProgress, progress } from '@core/models/progress.interface';
import { catchError,Observable,tap } from 'rxjs';
import { ErrorHandleService } from '../error-handle/error-handle.service';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})

export class TrackingCrudService {
  private hostedServer = `${environment.BaseUrl}/cohorts/progress`;
  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': '69420'
  });
  constructor(private http:HttpClient,private errorHandle: ErrorHandleService) { }

  getAllProgress(): Observable<CohortProgress[]> {
    return this.http.get<CohortProgress[]>(this.hostedServer, { headers: this.headers }).pipe(
      tap((response: CohortProgress[]) => console.log('Progress from Backend:', response)),
      catchError(this.errorHandle.handleError)
    );
  }


  updateProgress(updatedTrainee: progress): Observable<progress> {
    const url = `${this.hostedServer}/${updatedTrainee.id}`;
    return this.http.put<progress>(url, updatedTrainee).pipe(
      tap(() => console.log(`Updated progress for trainee ${updatedTrainee.traineeName}`)),
      catchError(this.errorHandle.handleError)
    );
  }
}
