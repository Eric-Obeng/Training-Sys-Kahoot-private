import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AssessmentData } from '@core/models/assessment-form.interface';
import { AssignAssessmentComponent } from '../assign-assessment/assign-assessment.component';

@Component({
  selector: 'app-assessment-card',
  standalone: true,
  imports: [CommonModule, AssignAssessmentComponent],
  templateUrl: './assessment-card.component.html',
  styleUrl: './assessment-card.component.scss',
})
export class AssessmentCardComponent {
  @Input() assessment!: AssessmentData;
  assessmentId?: number;

  showAssignAssessmentModal = false;

  onShowAssignAssessmentModal(id: number | undefined) {
    console.log(id);
    this.showAssignAssessmentModal = true;
    this.assessmentId = id;
  }

  onCloseAssignAssessmentModal() {
    this.showAssignAssessmentModal = false;
  }
}
