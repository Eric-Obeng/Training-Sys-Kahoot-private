import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { InputFieldComponent } from './input-field.component';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, InputFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.type).toBe('');
    expect(component.placeholder).toBe('');
    expect(component.label).toBe('');
    expect(component.uniqueId).toContain('input-');
    expect(component.disabled).toBeUndefined();
    expect(component.isPasswordVisible).toBe(false);
    expect(component.isDisabled).toBe(false);
  });

  it('should toggle password visibility', () => {
    component.type = 'password';
    component.togglePasswordVisibility();
    expect(component.isPasswordVisible).toBe(true);
    component.togglePasswordVisibility();
    expect(component.isPasswordVisible).toBe(false);
  });

  it('should write value', () => {
    component.writeValue('test');
    expect(component.value).toBe('test');
  });

  it('should register onChange function', () => {
    const fn = jest.fn();
    component.registerOnChange(fn);
    component.onChange('test');
    expect(fn).toHaveBeenCalledWith('test');
  });

  it('should register onTouched function', () => {
    const fn = jest.fn();
    component.registerOnTouched(fn);
    component.onTouched();
    expect(fn).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.isDisabled).toBe(true);
  });
});
