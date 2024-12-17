import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Question } from '@core/models/kahoot-questions';

@Component({
  selector: 'app-kahoot-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kahoot-questions.component.html',
  styleUrls: ['./kahoot-questions.component.scss'],
})
export class KahootQuestionsComponent {
  @Input() question!: Question;
  @Output() questionUpdate = new EventEmitter<any>();

  trackByIndex(index: number, item: string): number {
    return index;
  }

  addAnswer() {
    if (this.question) {
      this.question.options.push('');
      this.questionUpdate.emit(this.question);
    }
  }

  markAsCorrect(selectedAnswer: any) {
    if (this.question) {
      this.question.correctAnswer = selectedAnswer;
      this.questionUpdate.emit(this.question);
    }
  }

  updateAnswer(index: number, event: Event, inputElement: HTMLInputElement) {
    const target = event.target as HTMLInputElement;
    this.question.options[index] = target.value;
    setTimeout(() => inputElement.focus(), 0);
    this.questionUpdate.emit(this.question);
  }
}
