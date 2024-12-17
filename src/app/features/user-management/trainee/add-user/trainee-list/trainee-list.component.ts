import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TraineeInsystemService } from '../../../../../core/services/user-management/trainee/trainee-insystem.service';
import { BehaviorSubject, Observable, combineLatest, filter, map, of, tap } from 'rxjs';
import { User } from '../../../../../core/models/cohort.interface';
import { AsyncPipe, DatePipe, NgIf, TitleCasePipe } from '@angular/common';
import { PaginatorComponent } from '@core/shared/paginator/paginator.component';
import { SearchbarService } from '@core/services/searchbar/searchbar.service';
import { AddUserComponent } from '../add-user.component';

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
  trainerTabClicked: boolean = true;
  deleteTraineeEmail: string = '';

  public searchTermSubject = new BehaviorSubject<string>('');
  private searchTerm$ = this.searchTermSubject.asObservable(); 
  private statusFilterSubject = new BehaviorSubject<string | null>('');
  private statusFilter$: Observable<string | null> = this.statusFilterSubject.asObservable();
  private specializationFilter$ = new BehaviorSubject<string | null>(null);

  ellipsisClicked: boolean = false;
  selectedTraineeId: number | null = 0;
  isConfirmDeleteModalOpen = false;

  deleteModalSuccess = false;

  //Pagination
  private pageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.pageSubject.asObservable();
  pageSize = 3;
  totalPages = 1;


  // Get access into add user componet elements
  // @ViewChild('addUser', { static: true }) addUser!: ElementRef;
  
  constructor(
    private router: Router,
    private traineesInsystemService: TraineeInsystemService,
    private searchService: SearchbarService,
  ) {}



  ngOnInit() {
    this.onSearchChange()

    // Get cohort details with trainees list from service
    this.traineeUsers$ = this.traineesInsystemService.getAllTrainees();

    this.filteredTrainees$ = combineLatest([
      this.traineeUsers$, 
      this.searchTerm$, 
      this.statusFilter$, 
      this.specializationFilter$, 
      this.currentPage$ // Add current page observable
    ]).pipe(
      map(([trainees, searchTerm, statusFilter, specFilter, currentPage]) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
    
        // Filter trainees based on search term, status, and specialization
        const filteredTrainees = trainees.filter((trainee: User) => {
          const matchesSearch = 
            trainee.firstName.toLowerCase().includes(lowerSearchTerm) || 
            trainee.lastName.toLowerCase().includes(lowerSearchTerm) || 
            trainee.email.toLowerCase().includes(lowerSearchTerm) || 
            trainee.phoneNumber.includes(lowerSearchTerm);
    
          const matchesStatus = statusFilter ? trainee.status === statusFilter : true;
          const matchesSpecialization = specFilter ? trainee.specialization === specFilter : true;
    
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


  filterBySpecialization(spec: string) {
    this.specializationFilter$.next(spec)
  }

  clearSpecializationFilter() {
    this.specializationFilter$.next(null);
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
    this.router.navigate(['/home/admin/user-management/add-user-form'])
  }

  deleteUser(email: string) {
    this.deleteTraineeEmail = email;
    this.toggleConfirmDeleteModal();
  }

  confirmDelete() {
    this.traineesInsystemService.deleteSelectedTrainee(this.deleteTraineeEmail).pipe(
      tap(res => {
        console.log("deletion response: ", res)
      })
    )
    this.toggleConfirmDeleteModal();
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

  
  // Pagination
  onPageChange(page: number) {
    this.pageSubject.next(page);
  }


}
