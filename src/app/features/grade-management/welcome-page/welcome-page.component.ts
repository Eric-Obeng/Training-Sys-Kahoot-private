import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateAssessment } from '@core/models/assessment-form.interface';
import { CalendarModule } from 'primeng/calendar';
import { ModalComponent } from '../../assessment-system/components/modal/modal.component';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CalendarModule,
    FormsModule,
    CommonModule,
    ModalComponent,
  ],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
})
export class WelcomePageComponent implements OnInit {
  welcometimeUp: boolean = false;
  date: Date = new Date();
  minDate: Date = new Date();

  assessmentTypes: CreateAssessment[] = [];
  showModal = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.setModalDisplayTime();
  }

  private setModalDisplayTime() {
    setTimeout(() => {
      this.toggleTimeUp();
    }, 200);
  }

  toggleTimeUp() {
    this.welcometimeUp = !this.welcometimeUp;
  }

  navigateToAssessmentForm(type: string) {
    if (type === 'quiz') {
      this.showModal = true;
    } else {
      this.router.navigate(['/home/trainer/assessment/create', type]);
    }
  }

  handleCloseModal() {
    this.showModal = false;
  }
}
