import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatorComponent } from '@core/shared/paginator/paginator.component';
import { SearchbarComponent } from '@core/shared/searchbar/searchbar.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-view-grade-history',
  standalone: true,
  imports: [SearchbarComponent, PaginatorComponent],
  templateUrl: './view-grade-history.component.html',
  styleUrl: './view-grade-history.component.scss'
})
export class ViewGradeHistoryComponent {

  @ViewChild('ellipsisIcon') ellipsisIcon!: ElementRef;

  showEllipseOptions: boolean = false;

  //Pagination 
  private pageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.pageSubject.asObservable();
  pageSize = 4;
  totalPages = 1;

  constructor(
    private router: Router
  ) {}


  toggleEllipseOptions(event: Event) {
    event.stopPropagation();
    this.showEllipseOptions = !this.showEllipseOptions;
  }

  // Toggle off the more options box when anywhere on the document except the box is clicked
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if(this.ellipsisIcon && !this.ellipsisIcon.nativeElement.contains(event.target)) {
      this.showEllipseOptions = false;
    }
  }

  goToAssessmentOverview() {
    this.router.navigate(['/home/trainer/grade-management/grade-history/assessment-overview'])
  }


  // Pagination 
  onPageChange(page: number) {
    this.pageSubject.next(page);
  }
 
}
