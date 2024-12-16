import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TraineeQuizService {

  quizUrl = `${environment.BaseUrl}/assignments/trainee`;

  constructor(
    private http: HttpClient,
  ) { }

  getAllAssignments(traineeEmail: string | undefined) {
    const params = new HttpParams().set('traineeEmail', traineeEmail || '');
    return this.http.get<any[]>(this.quizUrl, { params });
  }
  
}
