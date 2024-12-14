import { AsyncPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ungradedTraineeList } from '@core/models/grade-management.interface';
import { GradeManagementService } from '@core/services/grade-management/grade-management.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-trainees-list',
  standalone: true,
  imports: [NgFor, AsyncPipe],
  templateUrl: './trainees-list.component.html',
  styleUrl: './trainees-list.component.scss'
})
export class TraineesListComponent {

  ungradedList$!: Observable<ungradedTraineeList[]>;

  constructor(
    private router: Router,
    private gradeManagementService: GradeManagementService,
  ) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.ungradedList$ = this.gradeManagementService.getUngradedTraineesList()
  }

  toGradeAssignment() {
    this.router.navigate(['/home/trainer/grade-management/grade-assignment'])
  }
}
