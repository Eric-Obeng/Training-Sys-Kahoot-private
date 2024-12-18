import { CommonModule ,} from '@angular/common';
import { Component,EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-delete-feedback',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './delete-feedback.component.html',
  styleUrl: './delete-feedback.component.scss'
})

export class DeleteFeedbackComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() title!: string;
  @Input() description!: string;

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
