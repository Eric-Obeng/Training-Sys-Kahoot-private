import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError,tap } from 'rxjs';
import { Ispecialization } from '../../models/specialization.interface';

@Injectable({
  providedIn: 'root'
})

export class SpecializationFacadeService {
  specializationSubject = new BehaviorSubject<Ispecialization[]>([]);
  specialization$ = this.specializationSubject.asObservable();

  private localServer: string = 'http://localhost:3000/specializations';
  private createEndpoint: string = 'http://localhost:8089/api/specializations';

  constructor(private http: HttpClient) {
    this.loadSpecializations();
  }

  private loadSpecializations(){
    this.getAllSpecializations()
      .subscribe({
        next: (specializations)=> this.specializationSubject.next(specializations),
        error: (error) => console.error('Error occurred while fetching specializations:', error)
      })
  }

  getAllSpecializations():Observable<Ispecialization[]>{
    return this.http.get<Ispecialization[]>(this.localServer)
    .pipe(catchError(this.handleError));
  }

  getSpecializationById(id: number):Observable<Ispecialization>{
    return this.http.get<Ispecialization>(`${this.localServer}/${id}`).pipe(
      catchError(this.handleError),
      tap(() => this.loadSpecializations())
    );
  }

  create(specialization: Ispecialization) {
    console.log('from service: creation done');
    return this.http.post(this.localServer, specialization)
    .pipe(
      catchError(this.handleError),
      tap(() => this.loadSpecializations())
    );
  }

  update(id: number,specialization: Partial<Ispecialization>){
    return this.http.patch<Ispecialization>(`${this.localServer}/${id}`,specialization)
    .pipe(
      catchError(this.handleError),
      tap(() => this.loadSpecializations())
    )
  }

  delete(id:number):Observable<void>{
    console.log('from service: delete done');
    return this.http.delete<void>(`${this.localServer}/${id}`)
    .pipe(
      catchError(this.handleError),
      tap(() => this.loadSpecializations())
    )
  }


  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
