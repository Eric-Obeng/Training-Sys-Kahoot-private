import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogConfig } from '@core/models/dialog';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [DialogModule, CommonModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent {
  @Input() visible: boolean = false;
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() imageSrc: string = '';
  @Output() closeDialog = new EventEmitter<void>();

  onClose() {
    this.closeDialog.emit();
  }
}
