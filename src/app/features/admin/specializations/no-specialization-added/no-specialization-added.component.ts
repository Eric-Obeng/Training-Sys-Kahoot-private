import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-specialization-added',
  standalone: true,
  imports:[RouterLink,MatButtonModule],
  templateUrl: './no-specialization-added.component.html',
  styleUrls: ['./no-specialization-added.component.scss']
})
export class NoSpecializationAddedComponent {
  constructor(private router: Router) {}

  navigateToCreate() {
    this.router.navigate(['home', 'admin', 'specialization-management', 'create']);
  }
}
