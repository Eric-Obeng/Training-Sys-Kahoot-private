import { NgIf } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

import { TraineesListComponent } from './trainees-list/trainees-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-ungraded-trainees-list',
  standalone: true,
  imports: [TabViewModule, TraineesListComponent],
  templateUrl: './view-ungraded-trainees-list.component.html',
  styleUrl: './view-ungraded-trainees-list.component.scss'
})
export class ViewUngradedTraineesListComponent {

  constructor(
    private router: Router,
  ) { }

}
