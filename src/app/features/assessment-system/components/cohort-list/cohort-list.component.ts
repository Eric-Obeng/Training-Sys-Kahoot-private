import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CohortDetails } from '@core/models/cohort.interface';
import { UserManagementTraineeService } from '@core/services/user-management/trainee/user-management-trainee.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-cohort-list',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './cohort-list.component.html',
  styleUrl: './cohort-list.component.scss',
})
export class CohortListComponent {
  @Input() activeCohort!: CohortDetails[];
  @Output() cohortSelectionChange = new EventEmitter<number[]>();

  selectedCohortIds: number[] = [];

  onCohortSelectionChange(cohortId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCohortIds.push(cohortId);
    } else {
      this.selectedCohortIds = this.selectedCohortIds.filter(
        (id) => id !== cohortId
      );
    }
    this.cohortSelectionChange.emit(this.selectedCohortIds);
  }
}
