import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, map, Observable } from 'rxjs';
import { specialization } from '../../models/specialization.interface';
import { ErrorHandleService } from '../error-handle/error-handle.service';
import { SpecializationCrudService } from '../specialization-crud/specialization-crud.service';

@Injectable({
  providedIn: 'root',
})
export class SpecializationFacadeService {
  private specializationSubject = new BehaviorSubject<specialization[]>([]);
  specialization$ = this.specializationSubject.asObservable();

  selectedSpecializationSubject = new BehaviorSubject<specialization>({
    id: undefined,
    name: '',
    description: '',
    prerequisites: [],
    createdAt: '',
  });
  selectedSpecialization$ = this.selectedSpecializationSubject.asObservable();

  private sortSubject = new BehaviorSubject<'asc' | 'desc'>('desc');
  sortDirection$ = this.sortSubject.asObservable();

  constructor(
    private errorService: ErrorHandleService,
    private specializationCrud: SpecializationCrudService
  ) {
    this.loadSpecializations();
  }

  private loadSpecializations() {
    this.specializationCrud.getAllSpecializations()
      .pipe(
        map(response => this.sort(response))
      )
      .subscribe({
        next: (specializations) =>
          this.specializationSubject.next(specializations),
        error: (error) =>
          console.error(
            'Error occurred while fetching specializations:',
            error
          ),
      });
  }

  private sort(specializations: specialization[]): specialization[] {
    const direction = this.sortSubject.value;
    return [...specializations].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  toggleSort() {
    const newDirection = this.sortSubject.value === 'asc' ? 'desc' : 'asc';
    this.sortSubject.next(newDirection);
    this.loadSpecializations();
  }

  getSpecializationById(id: number): Observable<specialization> {
    return this.specializationCrud.getSpecializationById(id)
      .pipe(
        tap((data) => {
          this.selectedSpecializationSubject.next(data);
        }),
        catchError(this.errorService.handleError),
        tap(() => this.loadSpecializations())
      );
  }

  create(specialization: specialization): Observable<any> {
    return this.specializationCrud.createSpecialization(specialization).pipe(
      catchError(this.errorService.handleError),
      tap(() => {
        this.loadSpecializations();
      })
    );
  }

  update(
    id: number,
    specialization: Partial<specialization>
  ): Observable<specialization> {
    return this.specializationCrud
      .updateSpecialization(id, specialization)
      .pipe(
        tap(() => this.loadSpecializations()),
        catchError(this.errorService.handleError)
      );
  }

  delete(id: number): Observable<void> {
    return this.specializationCrud.deleteSpecialization(id).pipe(
      tap(() => this.loadSpecializations()),
      catchError(this.errorService.handleError)
    );
  }
}
