import { Component } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, filter, map, of } from 'rxjs';
import { CohortDetails, CohortList, Trainees } from '../../../core/models/cohort.interface';
import { Router } from '@angular/router';
import { CohortDataService } from '../../../core/services/cohort-data/cohort-data.service';
import { AsyncPipe, CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { SearchbarComponent } from '../../../core/shared/searchbar/searchbar.component';
import { PaginatorComponent } from '@core/shared/paginator/paginator.component';

@Component({
  selector: 'app-trainees-list',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, SearchbarComponent, PaginatorComponent],
  templateUrl: './trainees-list.component.html',
  styleUrl: './trainees-list.component.scss'
})
export class TraineesListComponent {
  
  cohort$!: Observable<CohortDetails>; 
  cohortTrainees$!: Observable<Trainees[]>; // holds list of trainees in cohort
  filteredTrainees$!: Observable<Trainees[]>;
  
  private searchTerm$ = new BehaviorSubject<string>(''); 
  private statusFilter$ = new BehaviorSubject<string | null>(null);
  private specializationFilter$ = new BehaviorSubject<string | null>(null);

  ellipsisClicked: boolean = false;
  selectedTraineeName: string | null = '';

  //Pagination 
  private pageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.pageSubject.asObservable();
  pageSize = 4;
  totalPages = 1;

  constructor(
    private cohortDataService: CohortDataService, 
    private router: Router,
  ) {}

  ngOnInit() {
    // Get cohort details with trainees list from service
    this.cohort$ = this.cohortDataService.getSelectedCohortDetails(); 

    this.cohortTrainees$ = this.cohort$.pipe(
      map(data => data.trainees)
    );

    this.filteredTrainees$ = combineLatest([
      this.cohortTrainees$, 
      this.searchTerm$, 
      this.statusFilter$, 
      this.specializationFilter$, 
      this.currentPage$
    ]).pipe(
      map(([cohort, searchTerm, statusFilter, specFilter, page]) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        // Filter trainees based on search term, status, and specialization
        const filteredTrainees = cohort.filter((trainee: Trainees) => {
          const matchesSearch = trainee.fullName.toLowerCase().includes(lowerSearchTerm) || 
                                trainee.email.toLowerCase().includes(lowerSearchTerm);
          const matchesStatus = statusFilter ? trainee.status === statusFilter : true;
          const matchesSpecialization = specFilter ? trainee.specialization === specFilter : true;
    
          return matchesSearch && matchesStatus && matchesSpecialization;
        });
    
        // Update total pages based on the filtered trainees count
        this.totalPages = Math.ceil(filteredTrainees.length / this.pageSize);
    
        // Paginate the filtered trainees
        const startIndex = (page - 1) * this.pageSize;
        return filteredTrainees.slice(startIndex, startIndex + this.pageSize);
      })
    );
    
  }
  
  // Update search term on changes from the search bar
  onSearchChange(searchTerm: string): void {
    this.searchTerm$.next(searchTerm);
  }

  onSortList() {
    this.filteredTrainees$ = this.filteredTrainees$.pipe(
      map((trainees: Trainees[]) => trainees.sort((a, b) => a.fullName.localeCompare(b.fullName)))
    );
  }
  
  // Set the filter for each status and trigger re-evaluation
  filterByActive() {
    this.statusFilter$.next('Active');
  }
  
  filterByInactive() {
    this.statusFilter$.next('Inactive');
  }
  
  filterByDeactivated() {
    this.statusFilter$.next('Deactivated');
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

  // Delete item from trainees list
  deleteCohort(id: string) {
    // this.toggleHideDeleteModal()
    // this.deleteCohortById = id;
  }


  goToCreateCohort() {
    this.router.navigate(['home/admin/cohorts/create-cohort'])
  }

  // Pagination 
  onPageChange(page: number) {
    this.pageSubject.next(page);
  }

}


