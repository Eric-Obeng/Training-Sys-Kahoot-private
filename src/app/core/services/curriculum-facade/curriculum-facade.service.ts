import { Injectable } from '@angular/core';
import { curriculum } from '@core/models/curriculum.interface';
import { BehaviorSubject,combineLatest, map,tap,catchError, Observable } from 'rxjs';
import { ErrorHandleService } from '../error-handle/error-handle.service';
import { CurriculumCrudService } from '../curriculum-crud/curriculum-crud.service';


@Injectable({
  providedIn: 'root'
})

export class CurriculumFacadeService {
  private curriculumSubject = new BehaviorSubject<curriculum[]>([]);
  private searchTermSubject = new BehaviorSubject<string>('');
  private sortDirectionSubject = new BehaviorSubject<'asc' | 'desc'>('asc');

  readonly curriculum$ = this.curriculumSubject.asObservable();
  readonly searchTerm$ = this.searchTermSubject.asObservable();
  readonly sortDirection$ = this.sortDirectionSubject.asObservable();

  constructor(
    private errorService: ErrorHandleService,
    private curriculumCrud: CurriculumCrudService
  ) {
    this.refreshCurriculum();
  }


  readonly filteredAndSortedCurriculum$ = combineLatest([
    this.curriculum$,
    this.searchTerm$,
    this.sortDirection$
  ]).pipe(
    map(([curriculums, searchTerm, sortDirection]) => {
      let filtered = searchTerm.trim()
        ? curriculums.filter(c =>
            c.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : curriculums;
      return [...filtered].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      });
    })
  );

  private loadCurriculum() {
    this.curriculumCrud.getAllCurriculums().subscribe({
      next: (curriculums) => this.curriculumSubject.next(curriculums.content),
      error: (error) => {
        this.errorService.handleError(error);
      }
    });
  }

  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  toggleSortDirection() {
    const currentDirection = this.sortDirectionSubject.value;
    this.sortDirectionSubject.next(currentDirection === 'asc' ? 'desc' : 'asc');
  }


  refreshCurriculum() {
    this.loadCurriculum();
  }


  getSelectedCurriculum(id:string | null ){
    return this.curriculumCrud.getCurriculumById(id)
    .pipe(
      tap(() => { this.loadCurriculum(); }),
      catchError(this.errorService.handleError)
    )
  }

  create(curriculum: curriculum):Observable<any>{
    return this.curriculumCrud.createCurriculum(curriculum)
    .pipe(
      catchError(error => {
        console.error('Full error response:', error);
        return this.errorService.handleError(error);
      }),
      tap(() => {
        this.refreshCurriculum()
      })
    )
  }

  delete(id: string): Observable<any> {
    return this.curriculumCrud.deleteCurriculum(id).pipe(
      catchError(this.errorService.handleError),
      tap(() => {
        this.refreshCurriculum();
      })
    );
  }

  update(id: string, curriculum: curriculum){
    return this.curriculumCrud.updateCurriculum(id, curriculum)
    .pipe(
      tap(() => this.refreshCurriculum()),
      catchError(this.errorService.handleError)
    )
  }
}
