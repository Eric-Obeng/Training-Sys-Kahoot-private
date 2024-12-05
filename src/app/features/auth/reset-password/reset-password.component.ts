import { Component } from '@angular/core';
import { InputFieldComponent } from '../../../core/shared/input-field/input-field.component';
import { MessageComponent } from '../../../core/shared/message/message.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    InputFieldComponent,
    MessageComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  isLoading = false;
  showError = false;
  showSuccess = false;
  resetPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.showError = false;


    if (this.resetPasswordForm.valid) {
      this.isLoading = true;
      const { email } = this.resetPasswordForm.value;

      this.authService
        .resetPassword(email)
        .pipe(
          switchMap(() => timer(2000)),
          switchMap(() => {
            this.isLoading = false;
            this.showSuccess = true;
            return timer(1000);
          })
        )
        .subscribe({
          next: () => {
            this.route.navigate(['auth/reset-code-sent']);
          },
          error: (err) => {
            console.error(err);
            this.isLoading = false;
            this.showError = true;
          },
        });
    }
  }
}
