import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CurriculumFacadeService } from '@core/services/curriculum-facade/curriculum-facade.service';
import { Router } from '@angular/router';
import { DeleteFeedbackComponent } from "../../specializations/delete-feedback/delete-feedback.component";

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, DeleteFeedbackComponent],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {
  @Input() visible = false;
  @Input() curriculumId?: number;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() deleted = new EventEmitter<void>();
  showDeleteFeedback = false;

  constructor(private curriculumFacade: CurriculumFacadeService
    ,private router: Router) {}

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  confirmDelete() {
    if (!this.curriculumId) return;
    this.curriculumFacade.delete(this.curriculumId).subscribe({
      next: () => {
        this.deleted.emit();
        this.visible = false;
        this.showDeleteFeedback = true;
        this.navigateToList();
        this.close();
      },
      error: (error) => {
        console.error('Error deleting curriculum:', error);
      }
    });
  }

  private navigateToList(){
    this.router.navigate(['home','admin','curriculum-management'])
  }

  onFeedbackClose() {
    this.showDeleteFeedback = false;
    this.visibleChange.emit(false);
  }
}
