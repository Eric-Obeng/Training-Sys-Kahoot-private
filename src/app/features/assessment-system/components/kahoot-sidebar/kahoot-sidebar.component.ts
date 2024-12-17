import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '@core/models/kahoot-questions';

@Component({
  selector: 'app-kahoot-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kahoot-sidebar.component.html',
  styleUrl: './kahoot-sidebar.component.scss',
})
export class KahootSidebarComponent implements OnInit, OnChanges {
  @Input() questions: Question[] = [];
  @Output() questionSelected = new EventEmitter<Question>();
  @Output() questionsUpdated = new EventEmitter<Question[]>();
  selectedQuestion: Question | null = null;

  ngOnInit() {
    this.setFirstQuestionActive();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['questions']) {
      if (this.questions.length > 0 && (!this.selectedQuestion || changes['questions'].previousValue.length === 0)) {
        this.setFirstQuestionActive();
      }
    }
  }

  private setFirstQuestionActive() {
    if (this.questions.length > 0) {
      this.selectedQuestion = this.questions[0];
      this.questionSelected.emit(this.selectedQuestion);
    }
  }

  onQuestionClick(question: Question) {
    this.selectedQuestion = question;
    this.questionSelected.emit(question);
  }

  deleteQuestion(question: Question) {
    this.questions = this.questions.filter(q => q !== question);
    this.questionsUpdated.emit(this.questions);
    if (this.selectedQuestion === question) {
      this.selectedQuestion = this.questions.length > 0 ? this.questions[0] : null;
      if (this.selectedQuestion) {
        this.questionSelected.emit(this.selectedQuestion);
      }
    }
  }

  addQuestion(question: Question) {
    this.questions = [...this.questions, question];
    if (this.questions.length === 1) {
      this.setFirstQuestionActive();
    }
  }
}
