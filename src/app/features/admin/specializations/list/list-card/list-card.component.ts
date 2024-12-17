import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { specialization } from '@core/models/specialization.interface';



@Component({
  selector: 'app-list-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})

export class ListCardComponent {
  @Input() specialization!: specialization;
  @Input() isDropdownActive = false;
  @Output() dropdownToggled = new EventEmitter<Event>();
  @Output() actionTriggered = new EventEmitter<{event: Event, action: string, spec: specialization}>();

  onToggleDropdown(event: Event): void {
    this.dropdownToggled.emit(event);
  }

  Math = Math;

  onActionClick(event: Event, action: string): void {
    this.actionTriggered.emit({ event, action, spec: this.specialization });
  }


}
