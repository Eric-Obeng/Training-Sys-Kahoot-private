import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TraineeGradeHistory } from '@core/models/grade-management.interface';
import { GradeManagementService } from '@core/services/grade-management/grade-management.service';
import { PaginatorComponent } from '@core/shared/paginator/paginator.component';
import { SearchbarComponent } from '@core/shared/searchbar/searchbar.component';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-view-grade-history',
  standalone: true,
  imports: [SearchbarComponent, PaginatorComponent, AsyncPipe, NgFor, NgIf],
  templateUrl: './view-grade-history.component.html',
  styleUrl: './view-grade-history.component.scss'
})
export class ViewGradeHistoryComponent {

  @ViewChild('ellipsisIcon') ellipsisIcon!: ElementRef;

  showEllipseOptions: boolean = false;
  selectedTraineeEmail!: string | null;

  //Pagination 
  private pageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.pageSubject.asObservable();
  pageSize = 4;
  totalPages = 1;

  gradeHistoryList$!: Observable<TraineeGradeHistory[]>;
  isGradeHistoryLoading$!: Observable<boolean>;

  constructor(
    private gradeManagementService: GradeManagementService,
    private router: Router
  ) {}


  ngOnInit() {
    this.init()
  }

  init() {
    this.isGradeHistoryLoading$ = of(true);
    this.gradeHistoryList$ = this.gradeManagementService.getGradeHistoryList().pipe(
      tap(() => (this.isGradeHistoryLoading$ = of(false)))
    )
  }


  toggleEllipseOptions(traineeEmail: string, event: Event) {
    event.stopPropagation();
    this.selectedTraineeEmail = this.selectedTraineeEmail === traineeEmail ? null : traineeEmail;
    if(this.selectedTraineeEmail === null) {
      this.showEllipseOptions = false;
    }
    else if(this.selectedTraineeEmail === traineeEmail) {
      this.showEllipseOptions = true;
    }
  }

  // Toggle off the more options box when anywhere on the document except the box is clicked
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if(this.ellipsisIcon && !this.ellipsisIcon.nativeElement.contains(event.target)) {
      this.showEllipseOptions = false;
    }
  }

  goToAssessmentOverview(traineeEmail: string) {
    this.gradeManagementService.selectedTraineeEmail = traineeEmail;
    this.router.navigate(['/home/trainer/grade-management/grade-history/assessment-overview'])
  }


  // Pagination 
  onPageChange(page: number) {
    this.pageSubject.next(page);
  }
 
}
