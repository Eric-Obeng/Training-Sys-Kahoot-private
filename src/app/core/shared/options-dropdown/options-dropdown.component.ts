import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface DropdownOption {
  icon: string;
  label: string;
  action: string;
}
@Component({
  selector: 'app-options-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './options-dropdown.component.html',
  styleUrl: './options-dropdown.component.scss',
})
export class OptionsDropdownComponent {
  @Input() isActive = false;
  @Input() optionsIcon = '../../../../../assets/Images/svg/options-icon.svg';
  @Input() options: DropdownOption[] = [];

  @Output() toggle = new EventEmitter<Event>();
  @Output() optionSelected = new EventEmitter<{
    event: Event;
    action: string;
  }>();

  onToggle(event: Event): void {
    event.stopPropagation();
    this.toggle.emit(event);
  }

  onOptionSelect(event: Event, action: string): void {
    event.stopPropagation();
    this.optionSelected.emit({ event, action });
  }
}
