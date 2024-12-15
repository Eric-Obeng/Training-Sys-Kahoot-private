import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-assessment-tabs-second',
  standalone: true,
  imports: [TabViewModule, RouterOutlet],
  templateUrl: './assessment-tabs-second.component.html',
  styleUrl: './assessment-tabs-second.component.scss'
})
export class AssessmentTabsSecondComponent {
  
  activeIndex: number = 1;

  constructor(
    private router: Router,
  ) { }


  onTabChange(event: any) {
    if (event.index === 0) { // Index of the "Grade history" tab
        this.goToAssignments();
    }
  }

  goToAssignments() {
    this.router.navigate(['/home/trainer/grade-management/'])
  }
}
