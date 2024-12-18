import { BehaviorSubject, map, Observable, combineLatest, shareReplay, catchError, tap } from 'rxjs';
import { TrackingCrudService } from './../tracking-crud/tracking-crud.service';
import { Injectable } from '@angular/core';
import {  TraineeState } from '@core/models/progress.interface';
import { ErrorHandleService } from '../error-handle/error-handle.service';


@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private traineeStatesSubject = new BehaviorSubject<Map<number, TraineeState>>(new Map());
  private searchTermSubject = new BehaviorSubject<string>('');
  private sortDirectionSubject = new BehaviorSubject<'asc' | 'desc'>('asc');

  readonly searchTerm$ = this.searchTermSubject.asObservable();
  readonly sortDirection$ = this.sortDirectionSubject.asObservable();
  readonly traineeStates$ = this.traineeStatesSubject.asObservable();

  readonly filteredProgress$ = combineLatest({
    states: this.traineeStates$,
    searchTerm: this.searchTerm$,
    sortDirection: this.sortDirection$
  }).pipe(
    map(({ states, searchTerm, sortDirection }) => {
      let trainees = Array.from(states.values());

      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        trainees = trainees.filter(trainee =>
          trainee.fullName.toLowerCase().includes(searchLower)
        );
      }

            trainees = trainees.sort((a, b) => {
        const dateA = new Date(a.cohortEndDate).getTime();
        const dateB = new Date(b.cohortEndDate).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });

      return trainees.map(trainee => ({
        id: trainee.id,
        traineeName: trainee.fullName,
        currentPhase: trainee.currentPhase,
        progress: trainee.progress,
        completionDate: trainee.cohortEndDate
      }));
    }),
    shareReplay(1)
  );

  constructor(
    private trackProgress: TrackingCrudService,
    private errorHandle: ErrorHandleService
  ) {
    this.fetchProgress().subscribe();
  }

  private calculateInitialPhaseAndProgress(trainee: any): { currentPhase: 'foundation' | 'advance' | 'capstone', progress: number } {
    const daysInProgram = Math.floor(
      (new Date().getTime() - new Date(trainee.dateCreated).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysInProgram <= 30) {
      return { currentPhase: 'foundation', progress: 33 };
    } else if (daysInProgram <= 60) {
      return { currentPhase: 'advance', progress: 66 };
    } else {
      return { currentPhase: 'capstone', progress: 100 };
    }
  }

  fetchProgress(): Observable<any> {
    return this.trackProgress.getAllProgress().pipe(
      map(cohorts => {
        const stateMap = new Map<number, TraineeState>();

        cohorts.forEach(cohort => {
          cohort.trainees.forEach(trainee => {
            const { currentPhase, progress } = this.calculateInitialPhaseAndProgress(trainee);

            stateMap.set(trainee.id, {
              ...trainee,
              currentPhase,
              progress,
              cohortEndDate: cohort.endDate
            });
          });
        });

        return stateMap;
      }),
      tap(stateMap => this.traineeStatesSubject.next(stateMap)),
      catchError(error => {
        this.errorHandle.handleError(error);
        throw error;
      })
    );
  }

  updateTraineePhase(traineeId: number, newPhase: 'foundation' | 'advance' | 'capstone'): void {
    const currentStates = this.traineeStatesSubject.value;
    const trainee = currentStates.get(traineeId);
    if (!trainee) return;
    let progress: number;
    switch (newPhase) {
      case 'foundation':
        progress = (trainee.progress >= 1 && trainee.progress <= 33)
          ? trainee.progress
          : 33;
        break;
      case 'advance':
        progress = (trainee.progress > 33 && trainee.progress <= 66)
          ? trainee.progress
          : 66;
        break;
      case 'capstone':
        progress = (trainee.progress > 66 && trainee.progress <= 100)
          ? trainee.progress
          : 100;
        break;
    }

    const updatedStates = new Map(currentStates);
    updatedStates.set(traineeId, {
      ...trainee,
      currentPhase: newPhase,
      progress
    });

    this.traineeStatesSubject.next(updatedStates);
  }

  updateSearchTerm(term: string): void {
    this.searchTermSubject.next(term.trim());
  }

  updateSortDirection(direction: 'asc' | 'desc'): void {
    this.sortDirectionSubject.next(direction);
  }
}
