import { AsyncPipe, DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
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


  constructor(
    private gradeManagementService: GradeManagementService,
  ) {

  }

  ngOnInit() {
    this.init()
  }


  init() {
    this.gradedAssignments$ = this.gradeManagementService.getGradedAssessments()
    this.gradedAssignments$.subscribe({
      next: (res) => console.log("Get Graded response: ", res),
      error: (err) => console.log("Get all assessments error: ", err)
    })

    this.ungradedAssignments$ = this.gradeManagementService.getUngradedAssessments()
    this.ungradedAssignments$.subscribe({
      next: (res) => console.log("Get ungraded response: ", res),
      error: (err) => console.log("Get ungraded assessment err: ", err)
    })
  }
  
} 
