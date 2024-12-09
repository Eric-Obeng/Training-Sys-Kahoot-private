import { Component } from '@angular/core';

@Component({
  selector: 'app-assessment-overview',
  standalone: true,
  imports: [],
  templateUrl: './assessment-overview.component.html',
  styleUrl: './assessment-overview.component.scss'
})
export class AssessmentOverviewComponent {

  ellipsisClicked: boolean = false;

  constructor() {

  }

  toggleEllipsis() {
    this.ellipsisClicked = !this.ellipsisClicked;
    console.log(this.ellipsisClicked)
  }


}
