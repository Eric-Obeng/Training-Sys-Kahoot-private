import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackBar: MatSnackBar
  ) { }


  /**
   * Displays an error message in the snackbar.
   * @param message The error message to display.
   * @param action The action text (optional, default is 'Close').
   */
  showError(message: string, action: string = 'Close'): void {
    this.snackBar.open(message, action, {
      duration: 5000, // Snackbar stays for 5 seconds
      panelClass: ['snackbar-error'], // Custom style for errors
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  /**
   * Displays a success or informational message in the snackbar.
   * @param message The message to display.
   * @param action The action text (optional, default is 'Close').
   */
  showMessage(message: string, action: string = 'Close'): void {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar stays for 3 seconds
      panelClass: ['snackbar-message'], // Custom style for messages
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  
}
