import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  catchError, Observable,tap } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { specialization } from '../../models/specialization.interface';
import { ErrorHandlerService } from '../error-handle/error-handle.service';

@Injectable({
  providedIn: 'root',
})
export class SpecializationCrudService {
  private hostedServer = environment.BaseUrl;
  // private hostedServer = 'https://75fc-196-61-35-158.ngrok-free.app/api/v1'
  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': '69420'
  });


  constructor(
    private http: HttpClient,
    private errorService: ErrorHandlerService
  ) {}

  getAllSpecializations():Observable<specialization[]>{
    return this.http.get<specialization[]>(`${this.hostedServer}/specializations`,{ headers: this.headers })
    .pipe(
      catchError(this.errorService.handleError)
    );
  }

  getSpecializationById(id: number): Observable<specialization> {
    const url = `${this.hostedServer}/specializations/${id}`;
    return this.http.get<specialization>(url, { headers: this.headers })
  }

  createSpecialization(specialization: specialization){
    const url = `${this.hostedServer}/specializations`
    return this.http.post(url, specialization, { headers: this.headers })
  }

  updateSpecialization(
    id: number,
    specialization: Partial<specialization>
  ): Observable<specialization> {
    const url = `${this.hostedServer}/specializations/${id}`;
    return this.http.put<specialization>(url, specialization, { headers: this.headers })
  }

  deleteSpecialization(id: number): Observable<void> {
    const url = `${this.hostedServer}/specializations/${id}`;
    return this.http.delete<void>(url, { headers: this.headers })
  }
}
