import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ViewAssignmentsComponent } from './view-assignments/view-assignments.component';
import { Observable, of } from 'rxjs';
import { NgIf } from '@angular/common';
import { ViewGradeHistoryComponent } from '../view-grade-history-list/view-grade-history/view-grade-history.component';

@Component({
  selector: 'app-view-assessment-list',
  standalone: true,
  imports: [TabViewModule, ViewAssignmentsComponent, NgIf, ViewGradeHistoryComponent],
  templateUrl: './view-assessment-list.component.html',
  styleUrl: './view-assessment-list.component.scss'
})
export class ViewAssessmentListComponent {

  constructor() {
  }


}
