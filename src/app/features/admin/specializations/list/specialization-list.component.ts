import { Component, OnInit } from '@angular/core';
import { specialization } from '@core/models/specialization.interface';
import { NoSpecializationAddedComponent } from "../no-specialization-added/no-specialization-added.component";
import { CommonModule, NgFor } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { Router } from '@angular/router';
import { DeleteModalComponent } from "../delete-modal/delete-modal.component";
import { ListCardComponent } from "./list-card/list-card.component";
import { Observable, map,combineLatest, BehaviorSubject } from 'rxjs';
import { SpecializationFacadeService } from '@core/services/specialization-facade/specialization-facade.service';
import { PaginatorComponent } from "@core/shared/paginator/paginator.component";


interface ActionEvent {
  event: Event;
  action: string;
  spec: specialization;
}

@Component({
  selector: 'app-specialization-list',
  standalone: true,
  imports: [
    NoSpecializationAddedComponent,
    CommonModule,
    HeaderComponent,
    NgFor,
    DeleteModalComponent,
    ListCardComponent,
    PaginatorComponent
  ],
  templateUrl: './specialization-list.component.html',
  styleUrls: ['./specialization-list.component.scss']
})
export class SpecializationListComponent implements OnInit {
  activeDropdownIndex: number | null = null;
  deleteModalVisible = false;
  selectedSpecializationId?: number;
  deleteFeedbackMap = new Map<number | undefined, boolean>();

  specializations$!: Observable<specialization[]>;
  private pageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.pageSubject.asObservable()
  pageSize = 2;
  totalPages = 1;

  constructor(
    private router: Router,
    private specializationFacade: SpecializationFacadeService
  ) {}

  ngOnInit() {
    this.fetchSpecializations();
  }

  private fetchSpecializations() {
    this.specializations$ = combineLatest([
      this.specializationFacade.specialization$,
      this.currentPage$
    ]).pipe(
      map(([specializations, page]) =>{
        this.totalPages = Math.ceil(specializations.length / this.pageSize);
        const startIndex = (page-1) * this.pageSize;
        return specializations.slice(startIndex, startIndex + this.pageSize);
      })
    )
  }

  onPageChange(page: number) {
    this.pageSubject.next(page)
  }

  toggleDropdown(event: Event, index: number): void {
    event.stopPropagation();
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  closeDropdown(): void {
    this.activeDropdownIndex = null;
  }

  handleAction(actionEvent: ActionEvent): void {
    actionEvent.event.stopPropagation();
    switch (actionEvent.action) {
      case 'update':
        this.navigateToCreate(actionEvent.spec.id);
        break;
      case 'delete':
        this.selectedSpecializationId = actionEvent.spec.id;
        this.deleteModalVisible = true;
        this.deleteFeedbackMap.set(actionEvent.spec.id, false);
        break;
    }
    this.closeDropdown();
  }

  onSpecializationDeleted(id: number) {
    this.deleteFeedbackMap.set(id, true);
    setTimeout(() => {
      this.deleteFeedbackMap.delete(id);
      this.fetchSpecializations();
    }, 2000);
  }

  delete(id:number){
    this.specializationFacade.delete(id).subscribe({
      next: () => console.log('Specialization deleted'),
      error: (error) => console.error('Error deleting specialization:', error)
    })
  }

  private navigateToCreate(id: number | undefined): void {
    this.router.navigate(['home', 'admin', 'specialization-management', 'create'], {
      queryParams: { id }
    });
  }
}
