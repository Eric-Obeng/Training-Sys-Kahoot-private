import { Component } from '@angular/core';
import { TraineeDashboardComponent } from '../../../features/user-management/trainee/trainee-dashboard/trainee-dashboard.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [TraineeDashboardComponent, RouterOutlet],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {

}
