import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { content, curriculum } from '@core/models/curriculum.interface';
import { ErrorHandleService } from '../error-handle/error-handle.service';
import { catchError, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurriculumCrudService {
  private hostedServer = 'https://7016-196-61-35-158.ngrok-free.app/api/v1/curricula';
  private hostedCreate = 'https://7016-196-61-35-158.ngrok-free.app/api/v1/curricula/create';
  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': '69420'
  });

  constructor(
    private http: HttpClient,
    private errorService: ErrorHandleService
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
        console.error('Full error response:', error);
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
    const formData = new FormData();

    // Base curriculum fields
    if (curriculum.id) formData.append('id', curriculum.id);
    if (curriculum.title) formData.append('title', curriculum.title);
    if (curriculum.description) formData.append('description', curriculum.description);
    if (curriculum.specialization) formData.append('specialization', curriculum.specialization);
    if (curriculum.thumbnailImageUrl) formData.append('thumbnailImageUrl', curriculum.thumbnailImageUrl);

    // Learning objectives
    if (curriculum.learningObjectives?.length) {
      curriculum.learningObjectives.forEach((objective, index) => {
        if (objective) formData.append(`learningObjectives[${index}]`, objective);
      });
    }

    // Modules
    if (curriculum.modules?.length) {
      curriculum.modules.forEach((module, moduleIndex) => {
        if (module) {
          if (module.id !== undefined) formData.append(`modules[${moduleIndex}].id`, module.id.toString());
          if (module.title) formData.append(`modules[${moduleIndex}].title`, module.title);
          if (module.description) formData.append(`modules[${moduleIndex}].description`, module.description);
          if (module.estimatedTimeMinutes !== undefined) formData.append(`modules[${moduleIndex}].estimatedTimeMinutes`, module.estimatedTimeMinutes.toString());

          // Module topics
          if (module.topics?.length) {
            module.topics.forEach((topic, topicIndex) => {
              if (topic) formData.append(`modules[${moduleIndex}].topics[${topicIndex}]`, topic);
            });
          }

          // Module files
          if (module.fileUrl?.length) {
            module.fileUrl.forEach((fileObj, fileIndex) => {
              if (fileObj.file instanceof File) {
                formData.append(`modules[${moduleIndex}].fileUrl[${fileIndex}].file`, fileObj.file);
                formData.append(`modules[${moduleIndex}].fileUrl[${fileIndex}].name`, fileObj.name);
                formData.append(`modules[${moduleIndex}].fileUrl[${fileIndex}].size`, fileObj.size);
                formData.append(`modules[${moduleIndex}].fileUrl[${fileIndex}].type`, fileObj.type);
              }
            });
          }
        }
      });
    }

    // Log FormData contents
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });

    return formData;
  }
}
