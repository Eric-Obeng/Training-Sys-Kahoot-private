import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-module-list',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './module-list.component.html',
  styleUrl: './module-list.component.scss'
})

export class ModuleListComponent {
  @Input() modules!: FormArray;
  @Input() activeModuleIndex!: number;
  @Input() parentFormValid!: boolean;

  @Output() moduleSelected = new EventEmitter<number>();
  @Output() moduleRemoved = new EventEmitter<number>();
  @Output() createCurriculum = new EventEmitter<void>();

  selectModule(index: number): void {
    this.moduleSelected.emit(index);
  }

  removeModule(index: number, event: Event): void {
    event.stopPropagation();
    this.moduleRemoved.emit(index);
  }

  onComplete(): void {
    this.createCurriculum.emit();
  }
}
