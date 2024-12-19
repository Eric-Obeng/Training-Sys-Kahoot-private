import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandleService } from './error-handle.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorHandleService', () => {
  let service: ErrorHandleService;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  beforeEach(() => {
    mockSnackBar = {
      open: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        ErrorHandleService,
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    });

    service = TestBed.inject(ErrorHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleError', () => {
    it('should handle client-side error', (done) => {
      const errorEvent = new ErrorEvent('Client Error', {
        message: 'Client-side error occurred'
      });
      const httpError = new HttpErrorResponse({ error: errorEvent });

      service.handleError(httpError).subscribe({
        error: (error) => {
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            'Client-side error occurred',
            'Close',
            expect.any(Object)
          );
          expect(error).toBe(httpError);
          done();
        }
      });
    });

    it('should handle server-side error with message', (done) => {
      const httpError = new HttpErrorResponse({
        error: { message: 'Server error message' },
        status: 500,
        statusText: 'Internal Server Error'
      });

      service.handleError(httpError).subscribe({
        error: (error) => {
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            'Server error message',
            'Close',
            expect.any(Object)
          );
          expect(error).toBe(httpError);
          done();
        }
      });
    });

    it('should handle server-side error without message', (done) => {
      const httpError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found'
      });

      service.handleError(httpError).subscribe({
        error: (error) => {
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            'Error: 404 Not Found',
            'Close',
            expect.any(Object)
          );
          expect(error).toBe(httpError);
          done();
        }
      });
    });
  });

  describe('snackbar methods', () => {
    it('should show success snackbar', () => {
      service.showSuccessSnackbar('Success message');
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Success message',
        'Close',
        expect.objectContaining({
          duration: 3000,
          panelClass: ['success-snackbar']
        })
      );
    });

    it('should show error snackbar', () => {
      service.showErrorSnackbar('Error message');
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Error message',
        'Close',
        expect.objectContaining({
          duration: 5000,
          panelClass: ['error-snackbar']
        })
      );
    });
  });
});
