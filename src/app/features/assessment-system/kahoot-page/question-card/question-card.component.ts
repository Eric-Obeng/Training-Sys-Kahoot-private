import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '@core/models/kahoot-questions';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss',
})
export class QuestionCardComponent {
  @Input() question!: Question;
  @Output() addQuestion = new EventEmitter<Question>();

  onAddQuestion(question: Question) {
    this.addQuestion.emit(question);
  }
}
