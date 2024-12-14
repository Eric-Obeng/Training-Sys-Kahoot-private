import { AsyncPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { gradedTraineeList, ungradedTraineeList } from '@core/models/grade-management.interface';
import { GradeManagementService } from '@core/services/grade-management/grade-management.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-graded-trainees-list',
  standalone: true,
  imports: [NgFor, AsyncPipe],
  templateUrl: './graded-trainees-list.component.html',
  styleUrl: './graded-trainees-list.component.scss'
})
export class GradedTraineesListComponent {

  gradedList$!: Observable<gradedTraineeList[]>;

  constructor(
    private router: Router,
    private gradeManagementService: GradeManagementService,
  ) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.gradedList$ = this.gradeManagementService.getGradedTraineesList()
  }
}
