import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InputFieldComponent } from '../input-field/input-field.component';
import { interval, Subject, switchMap, takeUntil, timer } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-reset-code',
  standalone: true,
  imports: [
    CommonModule,
    InputFieldComponent,
    ReactiveFormsModule,
    MessageComponent,
  ],
  templateUrl: './reset-code.component.html',
  styleUrl: './reset-code.component.scss',
})
export class ResetCodeComponent {
  state: 'sent' | 'enter' = 'sent';
  codeExpiryTime = '10:00';
  private readonly EXPIRY_TIME_IN_SECONDS = 600;
  private timeRemaining = this.EXPIRY_TIME_IN_SECONDS;
  isExpired = false;
  private destroy$ = new Subject<void>();

  showErrorMessage = false;
  showSuccessMessage = false;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  otp: FormGroup = this.fb.group({
    otp: ['', Validators.required],
  });

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.state = data['state'];
    });
    this.codeExpiryTime = '10:00';
    this.startCountdown();
  }

  private startCountdown() {
    this.timeRemaining = this.EXPIRY_TIME_IN_SECONDS;
    this.isExpired = false;
    this.codeExpiryTime = '10:00';

    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.timeRemaining--;

        if (this.timeRemaining <= 0) {
          this.timeRemaining = 0;
          this.isExpired = true;
          this.codeExpiryTime = '00:00';
          return;
        }

        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;

        this.codeExpiryTime = `${String(minutes).padStart(2, '0')}:${String(
          seconds
        ).padStart(2, '0')}`;
      });
  }

  onEnterCode() {
    this.state = 'enter';
    this.router.navigate(['auth/reset-code-enter']);
  }

  onVerifyCode() {
    this.isLoading = true;

    if (this.otp.valid) {
      const { otp } = this.otp.value;

      this.authService
        .verifyOtp(otp)
        .pipe(
          switchMap(() => timer(2000)),
          switchMap(() => {
            this.isLoading = false;
            this.showSuccessMessage = true;
            return timer(1000);
          })
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/auth']);
          },
          error: (err) => {
            this.showErrorMessage = true;
            this.isLoading = false;
            console.error(err);
          },
        });
    }
  }

  onResendCode() {
    const decodedToken = JSON.parse(
      localStorage.getItem('decodedToken') || '{}'
    );
    const email = decodedToken.email;

    if (email) {
      this.authService.resetPassword(email).subscribe({
        next: () => {
          this.startCountdown();
        },
        error: (err) => {
          console.error('Error resending OTP', err);
        },
      });
    }
  }
}
