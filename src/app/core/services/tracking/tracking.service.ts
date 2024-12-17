import { BehaviorSubject, map, Observable, combineLatest, shareReplay, catchError, tap } from 'rxjs';
import { TrackingCrudService } from './../tracking-crud/tracking-crud.service';
import { Injectable } from '@angular/core';
import { progress } from '@core/models/progress.interface';
import { ErrorHandleService } from '../error-handle/error-handle.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private progressDataSubject = new BehaviorSubject<progress[]>([]);
  private searchTermSubject = new BehaviorSubject<string>('');
  private sortDirectionSubject = new BehaviorSubject<'asc' | 'desc'>('asc');

  readonly searchTerm$ = this.searchTermSubject.asObservable();
  readonly sortDirection$ = this.sortDirectionSubject.asObservable();
  readonly progressData$ = this.progressDataSubject.asObservable();

  readonly filteredProgress$: Observable<progress[]> = combineLatest({
    data: this.progressData$,
    searchTerm: this.searchTerm$,
    sortDirection: this.sortDirection$
  }).pipe(
    map(({ data, searchTerm, sortDirection }) => {
      let filteredData = [...data];
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filteredData = filteredData.filter(trainee =>
          trainee.traineeName.toLowerCase().includes(searchLower)
        );
      }
      return filteredData.sort((a, b) => {
        const dateA = new Date(a.completionDate).getTime();
        const dateB = new Date(b.completionDate).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }),
    shareReplay(1)
  );

  constructor(
    private trackProgress: TrackingCrudService,
    private errorHandle: ErrorHandleService
  ) {
    this.fetchProgress().subscribe();
  }

  fetchProgress(): Observable<progress[]> {
    return this.trackProgress.getAllProgress().pipe(
      tap((progress: progress[]) => this.progressDataSubject.next(progress)),
      catchError(error => {
        this.errorHandle.handleError(error);
        throw error;
      })
    );
  }

  updateSearchTerm(term: string): void {
    this.searchTermSubject.next(term.trim());
  }

  updateSortDirection(direction: 'asc' | 'desc'): void {
    this.sortDirectionSubject.next(direction);
  }

  updateTraineeProgress(updatedTrainee: progress): Observable<progress> {
    return this.trackProgress.updateProgress(updatedTrainee).pipe(
      tap(() => {
        const currentProgress = this.progressDataSubject.value;
        const updatedProgress = currentProgress.map(trainee =>
          trainee.id === updatedTrainee.id ? updatedTrainee : trainee
        );
        this.progressDataSubject.next(updatedProgress);
      }),
      catchError(error => {
        this.errorHandle.handleError(error);
        throw error;
      })
    );
  }
}
