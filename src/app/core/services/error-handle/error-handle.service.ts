import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SnackbarService } from '@core/services/snackbar/snackbar.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private snackbar: SnackbarService) {}

  /**
   * Handles HTTP errors and displays an error message.
   * @param error The HttpErrorResponse object.
   * @returns An observable that throws a user-friendly error.
   */
  public handleError(error: HttpErrorResponse) {
    // Extract a user-friendly error message
    const errorMessage = this.getErrorMessage(error);

    // Display the error message in the snackbar
    this.snackbar.showError(errorMessage);

    // Rethrow the error for further handling if necessary
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Extracts a user-friendly error message from an HttpErrorResponse.
   * @param error The HttpErrorResponse object.
   * @returns A user-friendly error message.
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      // Network or client-side error
      return 'Network error: Unable to connect to the server. Please try again later.';
    } else {
      // Backend error with status code and optional error message
      return error.error?.message || `Error ${error.status}: ${error.statusText}`;
    }
  }
}
