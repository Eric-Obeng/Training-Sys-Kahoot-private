import { AsyncPipe, DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentList } from '@core/models/grade-management.interface';
import { GradeManagementService } from '@core/services/grade-management/grade-management.service';
import { Observable, of, map, tap } from 'rxjs';

@Component({
  selector: 'app-view-assignments',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, TitleCasePipe, DatePipe],
  templateUrl: './view-assignments.component.html',
  styleUrl: './view-assignments.component.scss'
})
export class ViewAssignmentsComponent {

  gradedAssignments$!: Observable<AssessmentList[]>;
  ungradedAssignments$!: Observable<AssessmentList[]>;
  isGradedLoading$!: Observable<boolean>;
  isUngradedLoading$!: Observable<boolean>;


  constructor(
    private gradeManagementService: GradeManagementService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.init()
  }


  init() {
    this.isGradedLoading$ = of(true);
    this.gradedAssignments$ = this.gradeManagementService.getGradedAssessments().pipe(
      tap(() => (this.isGradedLoading$ = of(false)))
    );

    this.isUngradedLoading$ = of(true);
    this.ungradedAssignments$ = this.gradeManagementService.getUngradedAssessments().pipe(
      tap(() => (this.isUngradedLoading$ = of(false)))
    );
  }

  // Get list of graded trainees
  viewGradedTrainees(title: string) {
    this.gradeManagementService.getGradedTraineesList(title).subscribe({
      next: (res) => {
        console.log("ungraded trainees list res: ", res)
      },
      error: (err) => {
        console.error("ungraded trainees list error: ", err)
      }
    })
    this.goToGradedTrainees();
  }


  // Get list of ungraded trainees
  viewUngradedTrainees(title: string) {
    const titleString = title.trim()
    console.log(titleString)
    this.gradeManagementService.getUngradedTraineesList(titleString).subscribe({
      next: (res) => {
        console.log("ungraded trainees list res: ", res)
      },
      error: (err) => {
        console.error("ungraded trainees list error: ", err)
      }
    })
    this.goToGradedTrainees();
  }

  
  toUngradedList() {
    this.router.navigate(['home/trainer/grade-management/trainee-list'])
  }

  goToGradedTrainees() {  
      this.router.navigate(['/home/trainer/grade-management/graded-trainees-list'])
  }

} 
