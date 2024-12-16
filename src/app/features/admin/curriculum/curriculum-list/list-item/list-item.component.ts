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
  private documentClickListener!: (event: MouseEvent) => void;

  constructor(
    private router: Router,
    private curriculumFacadeService: CurriculumFacadeService
  ) {
    this.documentClickListener = this.handleDocumentClick.bind(this);
    document.addEventListener('click', this.documentClickListener);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.documentClickListener);
  }

  private handleDocumentClick(event: MouseEvent): void {
    const dropdownElement = (event.target as HTMLElement).closest('.options-dropdown');
    if (!dropdownElement) {
      this.isDropdownActive = false;
    }
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
        this.navigateToCreate(this.curriculum.id)
        break;
      case 'delete':
        this.isDeleteModalVisible = true;
        break;
    }
    this.isDropdownActive = false;
  }


  private navigateToCreate(id: string | undefined): void {
    this.router.navigate(['home', 'admin', 'curriculum-management', 'create-curriculum'], {
      queryParams: { id }
    });
  }
}
