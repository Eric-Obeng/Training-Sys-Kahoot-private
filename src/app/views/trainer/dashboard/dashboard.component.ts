import { Component } from '@angular/core';
import { NotificationCardComponent } from "../../../features/trainee/notification-card/notification-card.component";
import { TrackInfoCardComponent } from "../../../features/trainee/track-info-card/track-info-card.component";
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NotificationCardComponent,
    MatDivider, TrackInfoCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {

}
