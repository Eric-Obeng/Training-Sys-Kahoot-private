import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-question-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-list-item.component.html',
  styleUrl: './question-list-item.component.scss'
})
export class QuestionListItemComponent {
  @Input() questionNumber!: number;
  @Input() timestamp!: string;
}
