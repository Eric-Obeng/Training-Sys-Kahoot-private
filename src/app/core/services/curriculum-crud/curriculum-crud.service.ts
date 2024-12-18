import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { curriculum } from '@core/models/curriculum.interface';
import { ErrorHandleService } from '../error-handle/error-handle.service';
import { catchError, Observable,tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CurriculumCrudService {
  private hostedServer = 'http://localhost:3000/curriculums';

  constructor(private http: HttpClient,
    private errorService: ErrorHandleService
  ) {

   }

   getAllCurriculums():Observable<curriculum[]> {
    return this.http.get<curriculum[]>(this.hostedServer)
    .pipe(
      tap((response: any) => console.log('Specializations from Backend:' + response)),
      catchError(this.errorService.handleError)
    );
  }

  getCurriculumById(id: number) {
    const url = `${this.hostedServer}/${id}`;
    return this.http.get<curriculum>(url);
  }

  createCurriculum(curriculum: curriculum){
    return this.http.post<curriculum>(this.hostedServer,curriculum)
  }

  updateCurriculum(id: number, curriculum: curriculum): Observable<curriculum> {
    const url = `${this.hostedServer}/${id}`;
    return this.http.put<curriculum>(url, curriculum)
  }

  deleteCurriculum(id: number): Observable<any> {
    const url = `${this.hostedServer}/${id}`;
    return this.http.delete(url)
  }
}
