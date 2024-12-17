import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { TrackingService } from '@core/services/tracking/tracking.service';

@Component({
  selector: 'app-track-header',
  standalone: true,
  imports: [FormsModule, MatDivider],
  templateUrl: './track-header.component.html',
  styleUrl: './track-header.component.scss'
})
export class TrackHeaderComponent {
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';

  constructor(private trackingService: TrackingService) {}

  sort() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.trackingService.updateSortDirection(this.sortDirection);
  }

  onSearch(value: string) {
    this.searchTerm = value;
    this.trackingService.updateSearchTerm(this.searchTerm);
  }
}
