import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchbarService } from '../../services/searchbar/searchbar.service';
import { FormsModule } from '@angular/forms';
import { CohortDataService } from '../../services/cohort-data/cohort-data.service';
import { Observable } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { Specialization } from '../../models/cohort.interface';
import { UserManagementTraineeService } from '@core/services/user-management/trainee/user-management-trainee.service';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [FormsModule, NgFor, CommonModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss'
})
export class SearchbarComponent implements OnInit {



  // Emmitter to be used for triggering button element
  @Output() addButtonClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() searchChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortClicked: EventEmitter<void> = new EventEmitter<void>();

  @Output() activeStatus: EventEmitter<void> = new EventEmitter<void>();
  @Output() inactiveStatus: EventEmitter<void> = new EventEmitter<void>();
  @Output() deactivatedStatus: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetStatus: EventEmitter<void> = new EventEmitter<void>();
  @Output() specializationFilter: EventEmitter<string> = new EventEmitter<string>();
  @Output() resetSpecialization: EventEmitter<void> = new EventEmitter<void>();

  
  @Input() title!: string; // eg. Cohort
  @Input() placeholder!: string; //eg name
  @Input() buttonContent: string = 'Add Cohort';
  @Input() hide!: boolean;

  searchValue: string = '';
  filterVisible: boolean = false;

  allSpecializations$!: Observable<Specialization[]>;

  constructor(
    public searchbarService: SearchbarService,
    public cohortDataService: CohortDataService,
    public usermanagementService: UserManagementTraineeService,
  ) {}

  onAddClick(): void {
    this.addButtonClicked.emit();
  }

  ngOnInit() {
    this.allSpecializations$ = this.usermanagementService.getAllspecializations();
  }

  onSearchInput(): void {
    this.searchChanged.emit(this.searchValue);
  }

  onSortClicked(): void {
    this.sortClicked.emit()
  }

  onActiveClicked(): void {
    this.activeStatus.emit();
  }

  onInactiveClicked(): void {
    this.inactiveStatus.emit();
  }

  onDeactivedClicked(): void {
    this.deactivatedStatus.emit();
  }
  
  onResetStatusClicked(): void {
    this.resetStatus.emit();
  }

  onResetSpecializationClicked(): void {
    // event.stopPropagation()
    this.resetSpecialization.emit();
  }

  onSpecializationSelect(event: Event): void {
    const selectedSpecialization = (event.target as HTMLSelectElement).value;
    this.specializationFilter.emit(selectedSpecialization);
    console.log(selectedSpecialization)
}


  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }

}
