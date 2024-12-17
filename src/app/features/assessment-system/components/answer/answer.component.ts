import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.scss',
})
export class AnswerComponent {
  @Input() option!: string;
  @Input() answer!: string;
  @Input() index!: number;
  @Input() isCorrect!: boolean;
  @Output() deleteAnswer = new EventEmitter<void>();
  @Output() answerChange = new EventEmitter<string>();
  @Output() toggleCorrect = new EventEmitter<void>();

  onDeleteAnswer() {
    this.deleteAnswer.emit();
  }

  onAnswerInputChange(value: string) {
    this.answerChange.emit(value);
  }

  toggleMarkCorrect(event: Event) {
    this.toggleCorrect.emit();
    const button = event.target as HTMLElement;
    const parent = button.closest('.answers');
    if (parent) {
      const buttons = parent.querySelectorAll('.mark-correct');
      buttons.forEach(btn => btn.classList.remove('active'));
    }
    button.classList.add('active');
  }
}
