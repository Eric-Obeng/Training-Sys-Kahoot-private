import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ungradedTraineeList } from '@core/models/grade-management.interface';
import { GradeManagementService } from '@core/services/grade-management/grade-management.service';
import { Observable, Subject, of } from 'rxjs';

@Component({
  selector: 'app-trainees-list',
  standalone: true,
  imports: [NgFor, AsyncPipe, RouterOutlet, NgIf],
  templateUrl: './trainees-list.component.html',
  styleUrl: './trainees-list.component.scss'
})
export class TraineesListComponent {

  ungradedList$!: Observable<ungradedTraineeList[]>;

  selectedQuizTitle$!: Observable<string | null>;

  constructor(
    private router: Router,
    public gradeManagementService: GradeManagementService,
  ) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.ungradedList$ = this.gradeManagementService.getUngradedTraineesList()
    this.selectedQuizTitle$ = of(this.gradeManagementService.selectedAssessmentTitle)
  }

  toGradeAssignment(email: string) {
    this.gradeManagementService.selectedTraineeEmail = email;
    this.router.navigate(['/home/trainer/grade-management/grade-assignment'])
  }
}
