import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [],
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss'
})
export class ShareComponent {
    @Output() closeModal = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }

  copyLink() {
    const inputElement = document.querySelector('.col-1 input') as HTMLInputElement;
    if (inputElement) {
      inputElement.select();
      document.execCommand('copy');
    }
  }
}