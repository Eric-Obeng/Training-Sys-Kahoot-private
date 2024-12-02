import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { progress } from '@core/models/progress.interface';
import { TrackingService } from '@core/services/tracking/tracking.service';
import { SortEvent } from 'primeng/api';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-tracking-list',
  standalone: true,
  imports: [CommonModule, TableModule, ProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './tracking-list.component.html',
  styleUrl: './tracking-list.component.scss'
})

export class TrackingListComponent implements OnInit {
  progressData: progress[] = [];
  sortField: string = '';
  sortOrder: number = 1;

  constructor(private progressService: TrackingService) {}

  ngOnInit(): void {
    this.progressService.filteredProgress$.subscribe(data => {
      this.progressData = data;
    });
  }

  getAvatarUrl(fullName: string): string {
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) {
      return `https://avatar.iran.liara.run/username?username=${nameParts[0]}`;
    }
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    return `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;
  }


  onSort(event: SortEvent) {
    this.sortField = event.field!;
    this.sortOrder = event.order!;

    this.progressData.sort((a: any, b: any) => {
      let value1 = a[event.field!];
      let value2 = b[event.field!];


      if (event.field === 'completionDate') {
        value1 = new Date(value1).getTime();
        value2 = new Date(value2).getTime();
      }


      if (typeof value1 === 'string' && typeof value2 === 'string') {
        return event.order! * value1.localeCompare(value2, undefined, { sensitivity: 'base' });
      }


      return event.order! * (value1 < value2 ? -1 : value1 > value2 ? 1 : 0);
    });
  }
}
