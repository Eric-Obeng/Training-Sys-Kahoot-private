import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandleService {

  constructor(private snackBar: MatSnackBar) {}

  handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An error occurred. Please try again.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else if (typeof error.error === 'object' && error.error.message) {
      // Specific case: error object with an "error" property
      errorMessage = error.error.message
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error: ${error.status} ${error.statusText}`;
    }

    this.showErrorSnackbar(errorMessage);
    return throwError(() => error);
  }

  showErrorSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  showSuccessSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
