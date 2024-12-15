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

  private readonly selectedQuizStorageKey = 'selectedQuizTitle';

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

    this.ungradedList$.subscribe(data => console.log(data))

    // // Check if a value exists in localStorage
    // const savedTitle = localStorage.getItem(this.selectedQuizStorageKey);
    // if (savedTitle) {
    //   this.selectedQuizTitle$ = of(savedTitle); // Load from localStorage
    //   this.gradeManagementService.selectedAssessmentTitle = localStorage.getItem(this.selectedQuizStorageKey)
    //   this.ungradedList$ = this.gradeManagementService.getUngradedTraineesList()
    // } else {
    //   const title = this.gradeManagementService.selectedAssessmentTitle;
    //   this.selectedQuizTitle$ = of(title); // Set from the service
    //   localStorage.setItem(this.selectedQuizStorageKey, title || ''); // Save to localStorage
    // }
  }

  toGradeAssignment(email: string) {
    this.gradeManagementService.selectedTraineeEmail = email;
    this.router.navigate(['/home/trainer/grade-management/grade-assignment'])
  }
}
