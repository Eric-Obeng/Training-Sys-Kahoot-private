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
import { SearchbarService } from '@core/services/searchbar/searchbar.service';

@Component({
  selector: 'app-list-cohorts',
  standalone: true,
  imports: [AsyncPipe, NgIf, SearchbarComponent, ModalComponent, PaginatorComponent],
  templateUrl: './list-cohorts.component.html',
  styleUrl: './list-cohorts.component.scss'
})
export class ListCohortsComponent {
  
  cohortsList$!: Observable<CohortList[]>; 
  filteredCohorts$!: Observable<CohortList[]>;
  private searchTerm$!: Observable<string>;
  deleteCohortById: string = '';

  ellipsisClicked: boolean = false;
  selectedCohortId: string | null = ''; 
  hideDeleteModal: boolean = true;

  listEmptyCheck: boolean = true;

  //Pagination 
  private pageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.pageSubject.asObservable();
  pageSize = 4;
  totalPages = 1;

  constructor(
    private cohortDataService: CohortDataService, 
    private router: Router,
    public modalService: ModalService,
    private searchService: SearchbarService,
  ) {}

  ngOnInit() {

    this.onSearchChange();
    this.cohortsList$ = this.cohortDataService.getAllCohorts()

    this.cohortsList$.subscribe({
      next: (response) => {
        this.listEmptyCheck = false;
      },
      error: (err) => {
        console.error("cohort list error: ", err)
      }

    })

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
  onSearchChange(): void {
    this.searchTerm$ = this.searchService.searchTerm$;
  }

  onSortList() {
    this.filteredCohorts$ = this.filteredCohorts$.pipe(
      map((cohorts: CohortList[]) => cohorts.sort((a, b) => -1 - 1))
    )
  }

  //Get the Id of selected Cohort from list and make http request to get all details for cohort
  getSelectedCohortDetails(selectedCohortId: string) { 
    this.cohortDataService.selectedCohortId = selectedCohortId;
    this.storeSelectedCohortId(selectedCohortId)
    this.goToTraineesList()
  }

  storeSelectedCohortId(value: string) {
    localStorage.setItem('selectedCohortIdForTrainee', JSON.stringify(value));
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
    this.cohortDataService.selectedCohortId = id;
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
      error: (error) => {
        console.error("error deleting cohort: ", error)
      }
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
