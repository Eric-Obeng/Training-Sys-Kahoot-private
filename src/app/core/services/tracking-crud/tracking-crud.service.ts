import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { progress } from '@core/models/progress.interface';
import { catchError,Observable,tap } from 'rxjs';
import { ErrorHandleService } from '../error-handle/error-handle.service';

@Injectable({
  providedIn: 'root'
})

export class TrackingCrudService {
  private localServer = 'http://localhost:3000/progress';
  constructor(private http:HttpClient,private errorHandle: ErrorHandleService) { }

  getAllProgress(): Observable<progress[]> {
    return this.http.get<progress[]>(this.localServer).pipe(
      tap((response: progress[]) => console.log('Progress from Backend:' + response)),
      catchError(this.errorHandle.handleError)
    );
  }

  updateProgress(updatedTrainee: progress): Observable<progress> {
    const url = `${this.localServer}/${updatedTrainee.id}`;
    return this.http.put<progress>(url, updatedTrainee).pipe(
      tap(() => console.log(`Updated progress for trainee ${updatedTrainee.traineeName}`)),
      catchError(this.errorHandle.handleError)
    );
  }
}
