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
import { TokenService } from '../../services/token/token.service';

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
  timeRemaining = this.EXPIRY_TIME_IN_SECONDS;
  isExpired = false;
  private destroy$ = new Subject<void>();

  showErrorMessage = false;
  showSuccessMessage = false;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  otp: FormGroup = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.state = data['state'];
    });
    this.codeExpiryTime = '10:00';
    this.startCountdown();
  }

  startCountdown() {
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
          this.codeExpiryTime = 'Code has expired';
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
    this.showErrorMessage = false;

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
    this.startCountdown();

    const decodedToken = this.tokenService.getDecodedTokenValue();
    const email = decodedToken?.email;
    if (!email) {
      console.error('Email not found in token. Unable to resend code.');
      return;
    } else {
      this.authService.resetPassword(email).subscribe({
        next: () => {
          // this.startCountdown();
        },
        error: (err) => {
          console.error('Error resending OTP', err);
        },
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
