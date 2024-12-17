import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TraineeInsystemService } from '@core/services/user-management/trainee/trainee-insystem.service';
import { User } from '@core/models/cohort.interface';
import { catchError, filter, Observable, of, map } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-trainee-list',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './trainee-list.component.html',
  styleUrl: './trainee-list.component.scss',
})
export class TraineeListComponent {
  @Input() trainees: User[] = [];
  @Output() selectedTrainees = new EventEmitter<string[]>();

  @Input() selectAllChecked = false;

  selectedTraineeEmails: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  onTraineeSelect(trainee: User, event: any) {
    if (event.target.checked) {
      this.selectedTraineeEmails.push(trainee.email);
    } else {
      this.selectedTraineeEmails = this.selectedTraineeEmails.filter(email => email !== trainee.email);
    }
    this.selectAllChecked = this.selectedTraineeEmails.length === this.trainees.length;
    this.selectedTrainees.emit(this.selectedTraineeEmails);
  }

}
