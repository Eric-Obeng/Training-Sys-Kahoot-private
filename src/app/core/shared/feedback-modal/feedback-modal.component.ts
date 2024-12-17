import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [DialogModule, CommonModule],
  templateUrl: './feedback-modal.component.html',
  styleUrl: './feedback-modal.component.scss'
})

export class FeedbackModalComponent {
  @Input() visible: boolean = false;
  @Input() isUpdate: boolean = false;
  @Input() customTitle?: string;
  @Input() customMessage?: string;
  @Input() imagePath: string = '../../../../../assets/Images/svg/add-spec.svg';
  

  close(): void {
    this.visible = false;
  }

  get title(): string {
    if (this.customTitle) {
      return this.customTitle;
    }
    return this.isUpdate
      ? 'Specialization updated successfully'
      : 'Specialization successfully added';
  }

  get message(): string {
    if (this.customMessage) {
      return this.customMessage;
    }
    return this.isUpdate
      ? 'Specialization updated successfully! The changes have been saved and updated details are now available.'
      : 'Specialization added successfully! You can now view, assign trainees to this specialization, or update the details at any time.';
  }
}
