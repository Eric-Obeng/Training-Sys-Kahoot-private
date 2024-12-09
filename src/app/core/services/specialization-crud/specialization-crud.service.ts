import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import {  catchError, Observable,tap } from 'rxjs';
import { ErrorHandleService } from '../error-handle/error-handle.service';
import { environment } from '../../../../environments/environment.development';
import { specialization } from '../../models/specialization.interface';

@Injectable({
  providedIn: 'root'
})

export class SpecializationCrudService {
  private hostedServer = environment.BaseUrl;

  constructor(
    private http: HttpClient,
    private errorService: ErrorHandleService
  ) { }

  getAllSpecializations():Observable<specialization[]>{
    return this.http.get<specialization[]>(`${this.hostedServer}/specializations`)
    .pipe(

      tap((response) => console.log('Specializations from Backend:', response)),
      catchError(this.errorService.handleError)
    );
  }

  getSpecializationById(id: number):Observable<specialization>{
    const url = `${this.hostedServer}/specializations/${id}`;
    return this.http.get<specialization>(url)
  }

  createSpecialization(specialization: specialization){
    const url = `${this.hostedServer}/specializations`
    return this.http.post(url, specialization)
  }

  updateSpecialization(id: number, specialization: Partial<specialization>):Observable<specialization>{
    const url = `${this.hostedServer}/specializations/${id}`;
    return this.http.put<specialization>(url, specialization)
  }

  deleteSpecialization(id: number):Observable<void>{
    const url = `${this.hostedServer}/specializations/${id}`;
    return this.http.delete<void>(url)
  }
}
