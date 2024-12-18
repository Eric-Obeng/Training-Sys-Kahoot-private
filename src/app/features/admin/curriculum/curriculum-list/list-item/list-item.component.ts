import { Component, Input } from '@angular/core';
import { curriculum } from '@core/models/curriculum.interface';
import { OptionsDropdownComponent } from "../../../../../core/shared/options-dropdown/options-dropdown.component";
import { Router } from '@angular/router';
import { CurriculumFacadeService } from '@core/services/curriculum-facade/curriculum-facade.service';
import { DeleteModalComponent } from '../../delete-modal/delete-modal.component';


@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [OptionsDropdownComponent, DeleteModalComponent],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})

export class ListItemComponent {
  @Input() curriculum!: curriculum;
  @Input() curriculumIndex!: number;
  isDropdownActive = false;
  isDeleteModalVisible = false;

  constructor(
    private router: Router,
    private curriculumFacadeService: CurriculumFacadeService
  ) {
    document.addEventListener('click', () => {
      this.isDropdownActive = false;
    });
  }

  ngOnDestroy() {
    document.removeEventListener('click', () => {
      this.isDropdownActive = false;
    });
  }

  getTotalTopics(): number {
    return this.curriculum.modules.reduce((total, mod) => total + mod.topics.length, 0);
  }

  navigateToDetail() {
    this.router.navigate(['home','admin','curriculum-management','curriculum', this.curriculum.id ]);
  }

  dropdownOptions = [
    {
      icon: '../../../../../../assets/Images/svg/update.svg',
      label: 'Update',
      action: 'update'
    },
    {
      icon: '../../../../../../assets/Images/svg/spec-delete.svg',
      label: 'Delete',
      action: 'delete'
    }
  ];

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownActive = !this.isDropdownActive;
  }

  handleOptionSelect(data: {event: Event, action: string}): void {
    const { action } = data;
    switch(action) {
      case 'update':
        // Implement update logic if needed
        break;
      case 'delete':
        this.isDeleteModalVisible = true;
        break;
    }
    this.isDropdownActive = false;
  }


}
