import { Component } from '@angular/core';
import { CohortDataService } from '../../../core/services/cohort-data/cohort-data.service';
import { Cohort, CohortList } from '../../../core/models/cohort.interface';
import { BehaviorSubject, Observable, combineLatest, map, of } from 'rxjs';
import { AsyncPipe, NgFor, NgIf, } from '@angular/common';
import { SearchbarComponent } from '../../../core/shared/searchbar/searchbar.component';
import { Router, } from '@angular/router';
import { ModalComponent } from "../../../core/shared/modal/modal.component";
import { ModalService } from '../../../core/services/modal/modal.service';
import { PaginatorComponent } from '@core/shared/paginator/paginator.component';

@Component({
  selector: 'app-list-cohorts',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, SearchbarComponent, ModalComponent, PaginatorComponent],
  templateUrl: './list-cohorts.component.html',
  styleUrl: './list-cohorts.component.scss'
})
export class ListCohortsComponent {
  
  cohortsList$!: Observable<CohortList[]>; 
  filteredCohorts$!: Observable<CohortList[]>;
  private searchTerm$ = new BehaviorSubject<string>(''); 
  deleteCohortById: string = '';

  ellipsisClicked: boolean = false;
  selectedCohortId: string | null = ''; 
  hideDeleteModal: boolean = true;

  listEmptyCheck!: boolean;

  //Pagination 
  private pageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.pageSubject.asObservable();
  pageSize = 4;
  totalPages = 1;

  constructor(
    private cohortDataService: CohortDataService, 
    private router: Router,
    public modalService: ModalService
    
  ) {}

  ngOnInit() {
    this.cohortsList$ = this.cohortDataService.getAllCohorts()

    this.filteredCohorts$ = combineLatest([this.cohortsList$, this.searchTerm$, this.currentPage$]).pipe(
      map(([cohorts, searchTerm, page]) => {
        // Fixed the filter and return syntax
        const filteredCohorts = cohorts.filter(cohort =>
          cohort.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Calculate total pages
        this.totalPages = Math.ceil(filteredCohorts.length / this.pageSize);

        // Calculate start index for pagination
        const startIndex = (page - 1) * this.pageSize;

        // Return paginated filtered cohorts
        return filteredCohorts.slice(startIndex, startIndex + this.pageSize);
      })
    )
  }

  // Update search term on changes from the search bar
  onSearchChange(searchTerm: string): void {
    this.searchTerm$.next(searchTerm);
  }

  onSortList() {
    this.filteredCohorts$ = this.filteredCohorts$.pipe(
      map((cohorts: CohortList[]) => cohorts.sort((a, b) => -1 - 1))
    )
  }

  //Get the Id of selected Cohort from list and make http request to get all details for cohort
  getSelectedCohortDetails(selectedCohortId: string) { 
    this.cohortDataService.selectedCohortId = selectedCohortId;
    this.goToTraineesList()
  }


  toggleEllipsis(selectedCohort: string, event:Event) {
    event.stopPropagation();
    this.selectedCohortId = this.selectedCohortId === selectedCohort ? null : selectedCohort;
    if(this.selectedCohortId === null) {
      this.ellipsisClicked = false;
    }
    else if(this.selectedCohortId === selectedCohort) {
      this.ellipsisClicked = true;
    }
  }

  // Set data into form and route to edit cohort component
  setSelectedCohortId(id: string) {
    this.cohortDataService.selectedCohortForUpdate = id;
    this.goToUpdateCohort();
  }

  // Delete item from cohort list
  deleteCohort(id: string) {
    this.toggleHideDeleteModal()
    this.deleteCohortById = id;
  }


  toggleHideDeleteModal() {
    this.hideDeleteModal = !this.hideDeleteModal;
  }

  confirmDelete() {
    this.cohortDataService.deleteCohort(this.deleteCohortById).subscribe({
      next: (response) => {
        window.location.reload();
      },
      error: (error) => {}
    })
    this.toggleHideDeleteModal();
    this.modalService.toggleSuccessModal();
  }

  cancelDelete() {
    this. toggleHideDeleteModal();
  }



  goToCreateCohort() {
    this.router.navigate(['home/admin/cohorts/create-cohort'])
  }

  goToUpdateCohort() {
    this.router.navigate(['/home/admin/cohorts/update-cohort'])
  }

  goToTraineesList() {
    this.router.navigate(['/home/admin/cohorts/trainees-list'])
  }


  // Pagination 
  onPageChange(page: number) {
    this.pageSubject.next(page);
  }

}
