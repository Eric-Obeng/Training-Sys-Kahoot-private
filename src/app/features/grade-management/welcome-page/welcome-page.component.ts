import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [NgIf, NgFor, CalendarModule, FormsModule ],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent implements OnInit {

  welcometimeUp: boolean = false;
  date: Date = new Date()
  minDate: Date = new Date();


  constructor() {}


  ngOnInit() {
    this.setModalDisplayTime();
  }

  private setModalDisplayTime() {
    setTimeout(() => {
      this.toggleTimeUp();
    }, 1000)
  }

  toggleTimeUp() {
    this.welcometimeUp = !this.welcometimeUp;
  }

}
