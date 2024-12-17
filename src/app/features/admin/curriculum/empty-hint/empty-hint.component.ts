import { Component } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empty-hint',
  standalone: true,
  imports: [MatRipple,],
  templateUrl: './empty-hint.component.html',
  styleUrl: './empty-hint.component.scss'
})

export class EmptyHintComponent {

  constructor(private router:Router){}

  navigateToCreate(){
    console.log('navigate to create');
    this.router.navigate(['home/admin/curriculum-management/create-curriculum']);
  }
}
