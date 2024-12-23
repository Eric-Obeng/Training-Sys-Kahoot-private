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
import { OptionsDropdownComponent } from '@core/shared/options-dropdown/options-dropdown.component';
import { SearchbarService } from '@core/services/searchbar/searchbar.service';

@Component({
  selector: 'app-trainer-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, OptionsDropdownComponent],
  templateUrl: './trainer-list.component.html',
  styleUrl: './trainer-list.component.scss',
})
export class TrainerListComponent {
  trainersData$!: Observable<Trainer[]>;
  filteredTrainers$!: Observable<Trainer[]>;
  filteredTrainees$!: Observable<User[]>;
  trainerTabClicked: boolean = true;
  deleteTraineeEmail: string = '';
  selectedTrainerId: number | null = null;

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
    private trainersService: TrainerService,
    private searchbarService: SearchbarService
  ) {}

  ngOnInit() {
    this.trainersData$ = this.trainersService.getAllTrainers();

    this.filteredTrainers$ = combineLatest([
      this.trainersData$,
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

    this.searchbarService.searchTerm$.subscribe(term => {
      this.searchTerm$.next(term);
    });
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

  toggleMenu(trainerId: number, event: Event) {
    event.stopPropagation();
    this.selectedTrainerId =
      this.selectedTrainerId === trainerId ? null : trainerId;
  }

  getSelectedUser(traineeId: string, trainee: User) {
    this.traineesInsystemService.getSelectedTrainee(trainee);
    this.goToProfile(traineeId);
  }

  goToProfile(id: string) {
    this.router.navigate(['/home/admin/user-management/user-profile/']);
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

  openMenu(index: number, event: Event) {
    this.ellipsisClicked = true;
    event.stopPropagation(); // Prevent unwanted bubbling
    // Toggle the selected trainer's menu
    this.selectedTrainerId = this.selectedTrainerId === index ? null : index;
  }

  handleOptionSelected(
    event: { event: Event; action: string },
    trainer: Trainer
  ) {
    if (event.action === 'update') {
      this.navigateToTrainerForm(trainer);
    }
  }

  navigateToTrainerForm(trainer: Trainer) {
    this.trainersService.getTrainerByEmail(trainer.email).subscribe({
      next: (detailedTrainer) => {
        this.trainersService.setSelectedTrainer(detailedTrainer);
        this.router.navigate(['/home/admin/user-management/add-trianer']);
      },
      error: (error) => {
        console.error('Error fetching trainer details:', error);
      },
    });
  }
}
