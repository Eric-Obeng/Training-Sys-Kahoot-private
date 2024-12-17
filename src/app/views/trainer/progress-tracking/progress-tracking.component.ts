import { Component } from '@angular/core';
import { TrackHeaderComponent } from "../../../features/trainer/progression-tracking/track-header/track-header.component";
import { TrackingListComponent } from "../../../features/trainer/progression-tracking/tracking-list/tracking-list.component";
import { MatRipple } from '@angular/material/core';
import { TrackingService } from '@core/services/tracking/tracking.service';
import { FeedbackModalComponent } from "../../../core/shared/feedback-modal/feedback-modal.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-progress-tracking',
  standalone: true,
  imports: [TrackHeaderComponent, TrackingListComponent, MatRipple, FeedbackModalComponent],
  templateUrl: './progress-tracking.component.html',
  styleUrl: './progress-tracking.component.scss'
})

export class ProgressTrackingComponent {
  showFeedbackModal = false;
  constructor(
    private trackingService: TrackingService,
    private snackBar: MatSnackBar
  ) {}

  updateProgress() {
    this.trackingService.fetchProgress().subscribe({
      next: () => {
        this.showFeedbackModal = true;
        setTimeout(() => {
          this.showFeedbackModal = false;
        }, 2000);
      },
      error: (error) => {
        this.snackBar.open('Error updating progress. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
