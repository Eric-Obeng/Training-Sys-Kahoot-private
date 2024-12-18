import { curriculum } from './../../../../core/models/curriculum.interface';
import { Component, OnInit } from '@angular/core';
import { EmptyHintComponent } from '../empty-hint/empty-hint.component';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { CurriculumFacadeService } from '@core/services/curriculum-facade/curriculum-facade.service';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { OptionsDropdownComponent } from "../../../../core/shared/options-dropdown/options-dropdown.component";
import { DeleteModalComponent } from "../delete-modal/delete-modal.component";


@Component({
  selector: 'app-curriculum-list',
  standalone: true,
  imports: [EmptyHintComponent, HeaderComponent,
    CommonModule, TableModule,OptionsDropdownComponent,DeleteModalComponent],
  templateUrl: './curriculum-list.component.html',
  styleUrl: './curriculum-list.component.scss',
})

export class CurriculumListComponent implements OnInit {
  curriculums!: curriculum[];
  searchTerm: string = '';
  originalCurriculumsLength: number = 0;
  selectedRowIndex: number = -1;
  isDeleteModalVisible = false;
  selectedCurriculumId?: string;

  constructor(
    private curriculumService: CurriculumFacadeService,
    private router: Router
  ) {}

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


  ngOnInit(): void {
    this.curriculumService.filteredAndSortedCurriculum$.subscribe(
      curriculums => this.curriculums = curriculums
    );

    this.curriculumService.curriculum$.subscribe(
      curriculums => this.originalCurriculumsLength = curriculums.length
    );

    this.curriculumService.searchTerm$.subscribe(
      term => this.searchTerm = term
    );
  }

  get showNoSearchResults(): boolean {
    return this.originalCurriculumsLength > 0 && this.curriculums.length === 0 && this.searchTerm !== '';
  }

  get showNoCurriculums(): boolean {
    return this.originalCurriculumsLength === 0;
  }

  getTotalTopics(curriculum: curriculum): number {
    return curriculum.modules.reduce((total, mod) => total + mod.topics.length, 0);
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['home', 'admin', 'curriculum-management', 'curriculum', id]);
  }

  toggleDropdown(event: Event, index: number): void {
    event.stopPropagation();
    this.selectedRowIndex = this.selectedRowIndex === index ? -1 : index;
  }

  handleOptionSelect(data: { event: Event, action: string }, curriculum: curriculum): void {
    const { action } = data;
    switch(action) {
      case 'update':
        this.navigateToCreate(curriculum.id);
        break;
      case 'delete':
        this.selectedCurriculumId = curriculum.id;
        this.isDeleteModalVisible = true;
        break;
    }
    this.selectedRowIndex = -1;
  }

  private navigateToCreate(id: string | undefined): void {
    this.router.navigate(['home', 'admin', 'curriculum-management', 'create-curriculum'], {
      queryParams: { id }
    });
  }
}
