import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentOverview } from '@core/models/grade-management.interface';
import { GradeManagementService } from '@core/services/grade-management/grade-management.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-assessment-overview',
  standalone: true,
  imports: [NgFor, AsyncPipe, NgIf, DatePipe],
  templateUrl: './assessment-overview.component.html',
  styleUrl: './assessment-overview.component.scss'
})
export class AssessmentOverviewComponent {

  overviewData$!: Observable<AssessmentOverview[]>;

  ellipsisClicked: boolean = false;

  traineeName: string = '';
  traineeSpecialiation: string = '';
  selectedTraineeEmail: string | null = '';

  constructor(
    private router: Router, 
    private grademanagementService: GradeManagementService,
  ) {}


  ngOnInit() {
    this.init()
  }

  init() {
    this.overviewData$ = this.grademanagementService.getSingleTraineeGradeHistory();

    this.overviewData$.subscribe(data => {
      this.traineeName = `${data[0].firstName} ${data[0].lastName}`
      this.traineeSpecialiation = data[0].specialization;
    })
    
  }

  toggleEllipsis(traineeEmail: string, event: Event) {
    event.stopPropagation();
    
    this.selectedTraineeEmail = this.selectedTraineeEmail === traineeEmail ? null : traineeEmail
    if(this.selectedTraineeEmail === traineeEmail) {
      this.ellipsisClicked = true;
    }
    else if(this.selectedTraineeEmail === null) {
      this.ellipsisClicked = false;
    }
  }


}
