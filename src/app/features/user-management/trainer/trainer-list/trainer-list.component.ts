import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { User } from '@core/models/cohort.interface';
import { Trainer } from '@core/models/trainer.interface';
import { SvgService } from '@core/services/svg/svg.service';
import { TraineeInsystemService } from '@core/services/user-management/trainee/trainee-insystem.service';
import { TrainerService } from '@core/services/user-management/trainer/trainer.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { SearchbarComponent } from '../../../../core/shared/searchbar/searchbar.component';

@Component({
  selector: 'app-trainer-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, SearchbarComponent],
  templateUrl: './trainer-list.component.html',
  styleUrl: './trainer-list.component.scss',
})
export class TrainerListComponent {
  trainersData$!: Observable<Trainer[]>;
  filteredTrainees$!: Observable<User[]>;
  trainerTabClicked: boolean = true;
  deleteTraineeEmail: string = '';

  private searchTerm$ = new BehaviorSubject<string>('');
  private statusFilter$ = new BehaviorSubject<string | null>(null);
  private specializationFilter$ = new BehaviorSubject<string | null>(null);

  ellipsisClicked: boolean = false;
  selectedTraineeName: string | null = '';
  isConfirmDeleteModalOpen = false;

  deleteModalSuccess = false;

  constructor(
    private router: Router,
    private traineesInsystemService: TraineeInsystemService,
    private svgService: SvgService,
    private trainersService: TrainerService
  ) {}

  ngOnInit() {
    this.trainersData$ = combineLatest([
      this.trainersService.getAllTrainers(),
      this.searchTerm$,
    ]).pipe(
      map(([trainers, searchTerm]) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return trainers.filter(
          (trainer) =>
            trainer.firstName.toLowerCase().includes(lowerSearchTerm) ||
            trainer.lastName.toLowerCase().includes(lowerSearchTerm) ||
            trainer.email.toLowerCase().includes(lowerSearchTerm)
        );
      })
    );

    
  }

  tabClicked() {
    this.trainerTabClicked = !this.trainerTabClicked;
  }

  // Update search term on changes from the search bar
  onSearchChange(searchTerm: string): void {
    this.searchTerm$.next(searchTerm);
  }

  onSortList() {
    this.filteredTrainees$ = this.filteredTrainees$.pipe(
      map((trainees: User[]) =>
        trainees.sort((a, b) => a.firstName.localeCompare(b.firstName))
      )
    );
  }

  // Set the filter for each status and trigger re-evaluation
  filterByActive() {
    this.statusFilter$.next('active');
  }

  filterByInactive() {
    this.statusFilter$.next('inactive');
  }

  filterByDeactivated() {
    this.statusFilter$.next('deactivated');
  }

  clearStatusFilter() {
    this.statusFilter$.next(null);
  }

  filterBySpecialization(spec: string) {
    this.specializationFilter$.next(spec);
  }

  clearSpecializationFilter() {
    this.specializationFilter$.next(null);
  }

  toggleEllipsis(selectedTrainee: string, event: Event) {
    event.stopPropagation();
    this.selectedTraineeName =
      this.selectedTraineeName === selectedTrainee ? null : selectedTrainee;
    if (this.selectedTraineeName === null) {
      this.ellipsisClicked = false;
    } else if (this.selectedTraineeName === selectedTrainee) {
      this.ellipsisClicked = true;
    }
  }

  getSelectedUser(traineeId: string, trainee: User) {
    this.traineesInsystemService.getSelectedTrainee(trainee);
    this.goToProfile(traineeId);
  }

  goToProfile(id: string) {
    this.router.navigate(['/home/admin/user-management/user-profile/']);
  }

  deleteUser(email: string) {
    this.deleteTraineeEmail = email;
    this.toggleConfirmDeleteModal();
  }

  confirmDelete() {
    this.traineesInsystemService.deleteSelectedTrainee(this.deleteTraineeEmail);
    this.toggleConfirmDeleteModal();
    if (this.traineesInsystemService.deleteModalSuccessful) {
      this.toggleDeleteModalSuccess();
    }
  }

  toggleConfirmDeleteModal() {
    this.isConfirmDeleteModalOpen = !this.isConfirmDeleteModalOpen;
  }

  closeConfirmDeleteModal() {
    this.toggleConfirmDeleteModal();
  }

  toggleDeleteModalSuccess() {
    this.deleteModalSuccess = !this.deleteModalSuccess;
  }
}
