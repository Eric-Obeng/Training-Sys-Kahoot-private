import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-feedback-page',
  standalone: true,
  imports: [],
  templateUrl: './quiz-feedback-page.component.html',
  styleUrl: './quiz-feedback-page.component.scss'
})
export class QuizFeedbackPageComponent {

  constructor(
    private router: Router
  ) {}


  goToDashboard() {
    this.router.navigate(['/home/trainee/dashboard']);
  }
}
