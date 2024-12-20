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
      errorMessage = error.error.message;
    } else {      if (error.error) {
        if (error.error.code === 'RESOURCE_EXISTS') {
          errorMessage = error.error.details || error.error.message;
        } else {
          errorMessage = error.error.message || error.error.details || `Error: ${error.status} ${error.statusText}`;
        }
      } else {
        errorMessage = `Error: ${error.status} ${error.statusText}`;
      }
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
