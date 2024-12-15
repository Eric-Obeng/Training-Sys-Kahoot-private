import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AssessmentDetails } from '@core/models/grade-management.interface';
import { GradeManagementService } from '@core/services/grade-management/grade-management.service';
import { InputFieldComponent } from '@core/shared/input-field/input-field.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-grade-assignment',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, FormsModule, DatePipe],
  templateUrl: './grade-assignment.component.html',
  styleUrl: './grade-assignment.component.scss'
})
export class GradeAssignmentComponent {

  assessmentDetails$!: Observable<AssessmentDetails>;
  assignedScore!: number;

  isModalOpen: boolean = false;
  isErrorModal: boolean = false;

  constructor(
    private router: Router,
    public gradeManagementService: GradeManagementService,
  ) {}

  ngOnInit() {
    this.init()
  }

  init() {
    this.assessmentDetails$ = this.gradeManagementService.getAssessmentDetailsForGrading()
  }

  submitScore() {
    if(this.assignedScore > 0 && this.assignedScore < 101) {
      this.gradeManagementService.submitGradedAssessment(this.assignedScore).subscribe({
        next: (res) => {
          this.toggleModal()
        },
        error: (err) => {
          this.toggleErrorModal()
          setTimeout(() => {
            this.isErrorModal = false;
          }, 1500)
        }
      })
    }
    else {
      alert("Enter correct score")
    }
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  toggleErrorModal() {
    this.isErrorModal = !this.isErrorModal;
  }

  routeToAssessmentList() {
    this.router.navigate(['/home/trainer/grade-management'])
  }

}
