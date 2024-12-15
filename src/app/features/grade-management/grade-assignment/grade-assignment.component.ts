import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GradeManagementService } from '@core/services/grade-management/grade-management.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-grade-assignment',
  standalone: true,
  imports: [],
  templateUrl: './grade-assignment.component.html',
  styleUrl: './grade-assignment.component.scss'
})
export class GradeAssignmentComponent {

  assessmentDetails$!: Observable<any[]>;

  constructor(
    private router: Router,
    private gradeManagementService: GradeManagementService,
  ) {}

  ngOnInit() {
    this.init()
  }

  init() {
    this.assessmentDetails$ = this.gradeManagementService.getAssessmentDetailsForGrading()

    console.log(this.gradeManagementService.selectedAssessmentTitle)
    console.log(this.gradeManagementService.selectedTraineeEmail)

    this.assessmentDetails$.subscribe(data => console.log("assessment details: ", data))
  }

}
