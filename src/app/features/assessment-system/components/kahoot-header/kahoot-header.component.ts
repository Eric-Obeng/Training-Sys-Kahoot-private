import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { GenerateByAiComponent } from '../../kahoot-page/generate-by-ai/generate-by-ai.component';
import { RouterLink, RouterModule } from '@angular/router';
import { Question } from '@core/models/kahoot-questions';
import { KahootService } from '@core/services/assessment/kahoot/kahoot.service';
import { ShareComponent } from "../share/share.component";

@Component({
  selector: 'app-kahoot-header',
  standalone: true,
  imports: [CommonModule, GenerateByAiComponent, RouterModule, RouterLink, ShareComponent],
  templateUrl: './kahoot-header.component.html',
  styleUrl: './kahoot-header.component.scss',
})
export class KahootHeaderComponent {
  openAiModal: boolean = false;
  @Input() questions: Question[] = [];

  @Output() questionsAdded = new EventEmitter<Question[]>();
  @Output() currentQuestionSubmitted = new EventEmitter<Question[]>();

  showShareModal = true;

  constructor(private kahootService: KahootService) {}

  onOpenAiModal() {
    this.openAiModal = true;
  }

  onCloseAiModal() {
    this.openAiModal = false;
  }

  handleQuestionsAdded(questions: Question[]) {
    if (questions && Array.isArray(questions)) {
      this.questionsAdded.emit(questions);
      this.onCloseAiModal();
    } else {
      console.error('Invalid questions array:', questions);
    }
  }

  onSubmit() {
    this.currentQuestionSubmitted.emit(this.questions);

    // Ensure questions array is not empty before emitting
    if (this.questions.length > 0) {
      const normalizedQuestions = this.questions.map((question) => {
        const normalizeField = (field: any) => {
          if (field.value && typeof field.value === 'object') {
            return { name: field.name, value: field.value.value };
          }
          return field;
        };

        return {
          ...question,
          timeLimit: normalizeField(question.timeLimit),
          points: normalizeField(question.points),
        };
      });

      console.log('Normalized Questions:', normalizedQuestions);

      this.kahootService.createKahootQuiz(normalizedQuestions).subscribe({
        next: (response) => {
          console.log('Quiz created successfully', response);
        },
        error: (error) => {
          console.error('Error creating quiz', error);
        },
      });
    } else {
      console.error('No questions available to submit');
    }
  }

  onCloseShareModal() {
    this.showShareModal = false;
  }
}
