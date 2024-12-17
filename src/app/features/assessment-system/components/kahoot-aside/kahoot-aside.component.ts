import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { initializeDropdownOptions } from '../../../../utils/kahootDropDownData';

@Component({
  selector: 'app-kahoot-aside',
  standalone: true,
  imports: [FormsModule, DropdownModule, CommonModule],
  templateUrl: './kahoot-aside.component.html',
  styleUrl: './kahoot-aside.component.scss',
})
export class KahootAsideComponent implements OnInit {
  @Input() timeLimit!: { name: string; value: number };
  @Input() points!: { name: string; value: number };
  @Output() timeLimitChange = new EventEmitter<{ name: string; value: number }>();
  @Output() pointsChange = new EventEmitter<{ name: string; value: number }>();

  timeLimitOptions: { name: string; value: number }[] | undefined;
  pointsOptions: { name: string; value: number }[] | undefined;

  ngOnInit(): void {
    const dropdownOptions = initializeDropdownOptions();
    this.timeLimitOptions = dropdownOptions.timeLimit;
    this.pointsOptions = dropdownOptions.point;

    // Ensure default values
    if (!this.timeLimit) {
      this.timeLimit = this.timeLimitOptions[0] || { name: '15 seconds', value: 15 };
    }

    if (!this.points) {
      this.points = this.pointsOptions[0] || { name: 'Standard', value: 50 };
    }
  }

  onTimeLimitChange(event: any) {
    this.timeLimit = {
      name: event.value.name,
      value: event.value.value,
    } as { name: string; value: number };
    this.timeLimitChange.emit(this.timeLimit);
  }

  onPointsChange(event: any) {
    this.points = {
      name: event.value.name,
      value: event.value.value,
    } as { name: string; value: number };
    this.pointsChange.emit(this.points);
  }
}
