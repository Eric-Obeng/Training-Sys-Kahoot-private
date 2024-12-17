import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-add-feedback',
  standalone: true,
  imports: [DialogModule, CommonModule],
  templateUrl: './add-feedback.component.html',
  styleUrl: './add-feedback.component.scss'
})

export class AddFeedbackComponent {
  @Input() visible: boolean = false;
  @Input() isUpdate: boolean = false;

  close(){}

  get title(): string {
    return this.isUpdate
      ? 'Specialization updated successfully'
      : 'Specialization successfully added';
  }

  get message(): string {
    return this.isUpdate
      ? 'Specialization updated successfully! The changes have been saved and updated details are now available.'
      : 'Specialization successfully added! You can now view, assign trainees to this specialization, or update the details at any time.';
  }

}
