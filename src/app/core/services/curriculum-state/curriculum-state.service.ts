import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurriculumStateService {
  private curriculumFormSubject = new BehaviorSubject<FormGroup | null>(null);
  curriculumForm$ = this.curriculumFormSubject.asObservable();

  setCurriculumForm(form: FormGroup) {
    this.curriculumFormSubject.next(form);
  }

  getCurriculumForm(): Observable<FormGroup | null> {
    return this.curriculumForm$;
  }

  clearForm() {
    this.curriculumFormSubject.next(null);
  }
}
