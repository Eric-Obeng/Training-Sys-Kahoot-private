import { Component } from '@angular/core';
import { KahootHeaderComponent } from '../components/kahoot-header/kahoot-header.component';
import { KahootSidebarComponent } from '../components/kahoot-sidebar/kahoot-sidebar.component';
import { KahootQuestionsComponent } from '../components/kahoot-questions/kahoot-questions.component';
import { KahootAsideComponent } from '../components/kahoot-aside/kahoot-aside.component';
import { Question } from '@core/models/kahoot-questions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kahoot-page',
  standalone: true,
  imports: [
    KahootHeaderComponent,
    KahootSidebarComponent,
    KahootQuestionsComponent,
    KahootAsideComponent,
    CommonModule,
  ],
  templateUrl: './kahoot-page.component.html',
  styleUrl: './kahoot-page.component.scss',
})
export class KahootPageComponent {
  questions: Question[] = [];
  currentQuestion: Question = {
    questionText: '',
    options: [],
    correctAnswer: '',
    timeLimit: {name: '15 seconds', value: 15},
    points: {name: '', value: 50},
  };

  onQuestionsAdded(questions: Question[]) {
    if (questions && Array.isArray(questions)) {
      this.questions.push(...questions);
    } else {
      console.error('Invalid questions array:', questions);
    }
  }

  onAddedQuestions(addedQuestions: Question[]) {
    this.questions.push(...addedQuestions);
  }

  onSelectQuestion(question: Question) {
    this.currentQuestion = question;
  }

  handleCurrentQuestionSubmitted(questions: Question[]) {
    this.questions = questions;
  }

  onQuestionsUpdated(updatedQuestions: Question[]) {
    this.questions = updatedQuestions;
  }
}
