import { CommonModule } from '@angular/common';
import { SpecializationFacadeService } from '@core/services/specialization-facade/specialization-facade.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DeleteFeedbackComponent } from '../delete-feedback/delete-feedback.component';



@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule, CommonModule, DeleteFeedbackComponent],
  templateUrl: './delete-modal.component.html',
  styleUrl:'./delete-modal.component.scss'
})

export class DeleteModalComponent {
  @Input() visible = false;
  @Input() specializationId?: number;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() deleted = new EventEmitter<number>();

  showDeleteFeedback = false;

  constructor(private specializationFacade: SpecializationFacadeService) {}

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

   confirmDelete() {
    if (this.specializationId) {
      this.specializationFacade.delete(this.specializationId).subscribe({
        next: () => {
          this.deleted.emit(this.specializationId);
          this.visible = false;
          this.showDeleteFeedback = true;
        },
        error: (error) => console.error('Error deleting specialization:', error)
      });
    }
  }

  onFeedbackClose() {
    this.showDeleteFeedback = false;
    this.visibleChange.emit(false);
  }
}
