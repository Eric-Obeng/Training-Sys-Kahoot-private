import { FormControl, FormGroup } from '@angular/forms';
import { PasswordValidator } from './password-validator.service';

describe('PasswordValidator', () => {
  it('should return null if passwords match', () => {
    const formGroup = new FormGroup({
      password: new FormControl('password123'),
      confirmPassword: new FormControl('password123')
    });

    const result = PasswordValidator.matchPassword(formGroup);
    expect(result).toBeNull();
  });

  it('should return mismatch error if passwords do not match', () => {
    const formGroup = new FormGroup({
      password: new FormControl('password123'),
      confirmPassword: new FormControl('password456')
    });

    const result = PasswordValidator.matchPassword(formGroup);
    expect(result).toEqual({ mismatch: true });
  });
});
