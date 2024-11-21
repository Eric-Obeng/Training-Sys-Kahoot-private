import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SearchbarComponent } from '../../../../core/shared/searchbar/searchbar.component';
import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { TraineeInsystemService } from '../../../../core/services/user-management/trainee/trainee-insystem.service';
import { BehaviorSubject, Observable, catchError, combineLatest, map } from 'rxjs';
import { User } from '../../../../core/models/cohort.interface';
import { TraineeListComponent } from './trainee-list/trainee-list.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [SearchbarComponent, RouterModule, AsyncPipe, NgIf, TraineeListComponent,MatTabsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {

  traineeUsers$!: Observable<User[]>;
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
    private traineesInsystemService: TraineeInsystemService
  ) {}



  ngOnInit() {
    // Get cohort details with trainees list from service
    this.traineeUsers$ = this.traineesInsystemService.getAllTrainees(); 

    this.filteredTrainees$ = combineLatest([
      this.traineeUsers$, 
      this.searchTerm$, 
      this.statusFilter$, 
      this.specializationFilter$
    ]).pipe(
      map(([trainees, searchTerm, statusFilter, specFilter]) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
    
        return trainees.filter((trainee: User) => {
          // Check if trainee matches the search term
          const matchesSearch = 
            trainee.firstName.toLowerCase().includes(lowerSearchTerm) || 
            trainee.lastName.toLowerCase().includes(lowerSearchTerm) || 
            trainee.email.toLowerCase().includes(lowerSearchTerm) || 
            trainee.phoneNumber.includes(lowerSearchTerm);
    
          // Check if trainee matches the status filter
          const matchesStatus = statusFilter ? trainee.status === statusFilter : true;
    
          // Check if trainee matches the specialization filter
          const matchesSpecialization = specFilter ? trainee.specialization === specFilter : true;
    
          return matchesSearch && matchesStatus && matchesSpecialization;
        });
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
      map((trainees: User[]) => trainees.sort((a, b) => a.firstName.localeCompare(b.firstName)))
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
    this.specializationFilter$.next(spec)
  }

  clearSpecializationFilter() {
    this.specializationFilter$.next(null);
  }

  toggleEllipsis(selectedTrainee: string, event:Event) {
    event.stopPropagation();
    this.selectedTraineeName = this.selectedTraineeName === selectedTrainee ? null : selectedTrainee;
    if(this.selectedTraineeName === null) {
      this.ellipsisClicked = false;
    }
    else if(this.selectedTraineeName === selectedTrainee) {
      this.ellipsisClicked = true;
    }
  }

  getSelectedUser(traineeId: string, trainee: User) {
    this.traineesInsystemService.getSelectedTrainee(trainee);
    this.goToProfile(traineeId);
  }

  goToProfile(id: string) {
    this.router.navigate(['/home/admin/user-management/user-profile/'])
  }

  deleteUser(email: string) {
    this.deleteTraineeEmail = email;
    this.toggleConfirmDeleteModal();
  }

  confirmDelete() {
    this.traineesInsystemService.deleteSelectedTrainee(this.deleteTraineeEmail)
    this.toggleConfirmDeleteModal();
    if(this.traineesInsystemService.deleteModalSuccessful) {
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

  onTabChanged(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.setToTrainerTab();
    } else if (event.index === 1) {
      this.setToTraineeTab();
    }
  }


  setToTrainerTab() {
    this.trainerTabClicked = true;
    console.log(this.trainerTabClicked, 'trainer')
  }

  setToTraineeTab() {
    this.trainerTabClicked = false;
    console.log(this.trainerTabClicked, 'trainee')

  }










  goToAddUserForm() {
    this.router.navigate(['/home/admin/user-management/add-user-form']);
  }

  goToAddTrainerForm() {
    this.router.navigate(['/home/admin/user-management/add-trianer']);
  }

  goToTrainerOrTrainee() {
    if(this.trainerTabClicked === true) {
      this.router.navigate(['/home/admin/user-management/add-trainer'])
    }
    else if(this.trainerTabClicked === false) {
      this.router.navigate(['/home/admin/user-management/add-user-form'])
    }
  }
}
