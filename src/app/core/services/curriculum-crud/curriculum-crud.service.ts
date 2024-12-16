import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { content, curriculum } from '@core/models/curriculum.interface';
import { ErrorHandleService } from '../error-handle/error-handle.service';
import { catchError, map, Observable, tap } from 'rxjs';
import { TokenService } from '../token/token.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class CurriculumCrudService {
  private hostedServer = `${environment.BaseUrl}/curricula`;
  private hostedCreate = `${environment.BaseUrl}/curricula/create`;
  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': '69420'
  });

  constructor(
    private http: HttpClient,
    private errorService: ErrorHandleService,
    private tokenService: TokenService
  ) {}

  getAllCurriculums(): Observable<content> {
    return this.http.get<content>(this.hostedServer, { headers: this.headers })
      .pipe(
        map((res: content) => ({ content: res.content })),
        tap((data) => console.log(data)),
        catchError(this.errorService.handleError)
      );
  }

  getCurriculumById(id: string | null) {
    const url = `${this.hostedServer}/${id}`;
    return this.http.get<curriculum>(url, { headers: this.headers });
  }

  createCurriculum(curriculum: curriculum) {
    const formData = this.createFormData(curriculum);
    return this.http.post<curriculum>(this.hostedCreate, formData, { headers: this.headers }).pipe(
      catchError(error => {
        return this.errorService.handleError(error);
      })
    );
  }

  updateCurriculum(id: string, curriculum: Partial<curriculum>): Observable<curriculum> {
    const formData = this.createFormData(curriculum);
    const url = `${this.hostedServer}/${id}`;
    return this.http.put<curriculum>(url, formData, { headers: this.headers }).pipe(
      tap((res) => console.log('updating curriculum happening:' + res)),
      catchError(this.errorService.handleError)
    );
  }

  deleteCurriculum(id: string): Observable<any> {
    const url = `${this.hostedServer}/${id}`;
    return this.http.delete(url);
  }

  private createFormData(curriculum: Partial<curriculum>): FormData {
    const userEmail = this.tokenService.getDecodedTokenValue()?.email
    const formData = new FormData();
    if (userEmail) formData.append('createdBy', userEmail);
    if (curriculum.id) formData.append('id', curriculum.id);
    if (curriculum.title) formData.append('title', curriculum.title);
    if (curriculum.description) formData.append('description', curriculum.description);
    if (curriculum.specialization) formData.append('specialization', curriculum.specialization);
    if (curriculum.thumbnailImage) {
      const isFile = (value: any): value is File => value instanceof File;
      if (isFile(curriculum.thumbnailImage)) {
        formData.append('thumbnailImage', curriculum.thumbnailImage, curriculum.thumbnailImage.name);
      } else if (typeof curriculum.thumbnailImage === 'string') {
        formData.append('thumbnailImage', curriculum.thumbnailImage);
      }
    }

    if (curriculum.learningObjectives?.length) {
      curriculum.learningObjectives.forEach((objective) => {
        formData.append(`learningObjectives`, objective);
      });
    }

    if (curriculum.modules?.length) {
      curriculum.modules.forEach((module, moduleIndex) => {
        if (module.id !== undefined) formData.append(`modules[${moduleIndex}].id`, module.id.toString());
        if (module.title) formData.append(`modules[${moduleIndex}].title`, module.title);
        if (module.description) formData.append(`modules[${moduleIndex}].description`, module.description);
        if (module.estimatedTimeMinutes !== undefined)
          formData.append(`modules[${moduleIndex}].estimatedTimeMinutes`, module.estimatedTimeMinutes.toString());
        if (module.topics?.length) {
          module.topics.forEach((topic,) => {
            formData.append(`modules[${moduleIndex}].topics`, topic);
          });
        }
        if (module.moduleFile?.length) {
          module.moduleFile.forEach((fileObj) => {
            if (fileObj.file instanceof File) {
              formData.append(
                `modules[${moduleIndex}].moduleFile`,
                fileObj.file,
              );
            }
          });
        }
      });
    }
    return formData;
  }
}
