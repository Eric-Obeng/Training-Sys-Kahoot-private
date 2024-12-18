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
    let errorMessage = this.extractErrorMessage(error);

    if (!errorMessage) {
      // Default fallback if no specific error message is found
      errorMessage = `Error: ${error.status} ${error.statusText}`;
    }

    this.showErrorSnackbar(errorMessage);
    return throwError(() => error);
  }

  private extractErrorMessage(error: any): string {
    if (!error) return '';

    // Handle client-side or network errors
    if (error.error instanceof ErrorEvent) {
      return error.error.message;
    }

    // Handle error structures with nested error objects
    let message = error.message || '';
    if (error.error) {
      if (typeof error.error === 'string') {
        message = error.error;
      } else if (typeof error.error === 'object') {
        message = this.extractErrorMessage(error.error); // Recursive extraction
      }
    }

    return message || 'An error occurred. Please try again.';
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
