import { CommonModule } from '@angular/common';
import { SpecializationFacadeService } from '@core/services/specialization-facade/specialization-facade.service';
import { Component } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ MatRippleModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  sortDirection$ = this.specializationFacade.sortDirection$

  constructor( private router: Router,
    private specializationFacade:SpecializationFacadeService
  ){}

  navigateToCreate() {
    this.router.navigate(['home', 'admin', 'specialization-management', 'create']);
  }

  toggleSort(){
    this.specializationFacade.toggleSort();
  }
}
