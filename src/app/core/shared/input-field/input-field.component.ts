import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputFieldComponent),
    },
  ],
})
export class InputFieldComponent implements ControlValueAccessor {
  @Input() type: string = '';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() uniqueId: string = `input-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  @Input() disabled!: boolean;
  @Input() required!: boolean;

  isPasswordVisible: boolean = false;
  isDisabled: boolean = false;

  private _value: string = '';

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    this.onChange(val);
  }

  onChange = (val: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    if (this.type === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
  }
}
