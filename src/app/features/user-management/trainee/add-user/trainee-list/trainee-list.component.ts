import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TraineeInsystemService } from '../../../../../core/services/user-management/trainee/trainee-insystem.service';
import { BehaviorSubject, Observable, combineLatest, filter, map, of, tap } from 'rxjs';
import { User } from '../../../../../core/models/cohort.interface';
import { AsyncPipe, DatePipe, NgIf, TitleCasePipe } from '@angular/common';
import { PaginatorComponent } from '@core/shared/paginator/paginator.component';
import { SearchbarService } from '@core/services/searchbar/searchbar.service';
import { AddUserComponent } from '../add-user.component';
import { FilterService } from '@core/services/user-management/filter/filter.service';

@Component({
  selector: 'app-trainee-list',
  standalone: true,
  imports: [AsyncPipe, NgIf, TitleCasePipe, PaginatorComponent, DatePipe],
  templateUrl: './trainee-list.component.html',
  styleUrl: './trainee-list.component.scss'
})
export class TraineeListComponent {
  traineeUsers$!: Observable<User[]>;
  filteredTrainees$!: Observable<User[]>;
  filter$!: Observable<string | null>;
  trainerTabClicked: boolean = true;
  deleteTraineeEmail: string = '';

  public searchTermSubject = new BehaviorSubject<string>('');
  private searchTerm$ = this.searchTermSubject.asObservable(); 


  ellipsisClicked: boolean = false;
  selectedTraineeId: number | null = 0;
  isConfirmDeleteModalOpen = false;

  deleteModalSuccess = false;

  //Pagination
  private pageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.pageSubject.asObservable();
  pageSize = 3;
  totalPages = 1;

  
  constructor(
    private router: Router,
    private traineesInsystemService: TraineeInsystemService,
    private searchService: SearchbarService,
    private filterService: FilterService,
  ) {}



  ngOnInit() {
    this.onSearchChange()
    this.filterBySpecialization()

    // Get cohort details with trainees list from service
    this.traineeUsers$ = this.traineesInsystemService.getAllTrainees();

    this.filteredTrainees$ = combineLatest([
      this.traineeUsers$, 
      this.searchTerm$, 
      this.filter$,
      this.currentPage$ // Add current page observable
    ]).pipe(
      map(([trainees, searchTerm, filter, currentPage]) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
    
        // Filter trainees based on search term, status, and specialization
        const filteredTrainees = trainees.filter((trainee: User) => {
        const matchesSearch = 
          trainee.firstName.toLowerCase().includes(lowerSearchTerm) || 
          trainee.lastName.toLowerCase().includes(lowerSearchTerm) || 
          trainee.email.toLowerCase().includes(lowerSearchTerm) || 
          trainee.phoneNumber.includes(lowerSearchTerm);
  
        const matchesStatus = filter ? trainee.status === filter : true;
        const matchesSpecialization = filter ? trainee.specialization === filter : true;
  
        return matchesSearch && matchesStatus && matchesSpecialization;
      });
    
        // Calculate total pages
        this.totalPages = Math.ceil(filteredTrainees.length / this.pageSize);
    
        // Calculate start index for pagination
        const startIndex = (currentPage - 1) * this.pageSize;
    
        // Return paginated filtered trainees
        return filteredTrainees.slice(startIndex, startIndex + this.pageSize);
      })
    );
    
    
  }


  onSearchChange(): void {
    this.searchTerm$ = this.searchService.searchTerm$;
  }


  tabClicked() {
    this.trainerTabClicked = !this.trainerTabClicked;
  }


  // Update search term on changes from the search bar

  onSortList() {
    this.filteredTrainees$ = this.filteredTrainees$.pipe(
      map((trainees: User[]) => trainees.sort((a, b) => a.firstName.localeCompare(b.firstName)))
    );
  }


  filterBySpecialization() {
    this.filter$ = this.filterService.filterValue$;
  }

  toggleEllipsis(selectedTrainee: number, event:Event) {
    event.stopPropagation();
    this.selectedTraineeId = this.selectedTraineeId === selectedTrainee ? null : selectedTrainee;
    if(this.selectedTraineeId === null) {
      this.ellipsisClicked = false;
    }
    else if(this.selectedTraineeId === selectedTrainee) {
      this.ellipsisClicked = true;
    }
  }

  getSelectedUser(traineeEmail: string, traineeId: number) {
    this.traineesInsystemService.selectedEmailSubject.next(traineeEmail)
    this.traineesInsystemService.selectedTraineeId = traineeId;
    this.goToCreateUser();
  }

  goToCreateUser() {
    this.resetFormFields()
    this.router.navigate(['/home/admin/user-management/add-user-form'])
  }

  resetFormFields() {
    this.traineesInsystemService.setFirstFormState(null);
    this.traineesInsystemService.setSecondFormState(null);
    this.traineesInsystemService.retreivedUserDataSubject.next(null)
  }

  deleteUser(email: string) {
    this.deleteTraineeEmail = email;
    this.toggleConfirmDeleteModal()
  }

  confirmDelete() {
    this.isConfirmDeleteModalOpen = false;
    this.traineesInsystemService.deleteSelectedTrainee(this.deleteTraineeEmail).subscribe({
      next: () => {
        this.toggleDeleteModalSuccess();
      }

    })
  }

  toggleConfirmDeleteModal() {
    this.isConfirmDeleteModalOpen = !this.isConfirmDeleteModalOpen;
  }

  closeConfirmDeleteModal() {
    this.toggleConfirmDeleteModal();
  }

  closeDeleteModalSuccess() {
    this.toggleDeleteModalSuccess();
    this.ngOnInit()
  }

  toggleDeleteModalSuccess() {
    this.deleteModalSuccess = !this.deleteModalSuccess;
  }

  
  // Pagination
  onPageChange(page: number) {
    this.pageSubject.next(page);
  }


}
