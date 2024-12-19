import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');
  const authService = inject(AuthService);

  // Add Authorization header if token exists
  const modifiedReq = req.clone({
    headers: req.headers
      .set('ngrok-skip-browser-warning', '69420') // Add ngrok header
      .set('Authorization', token ? `Bearer ${token}` : ''),
  });

  return next(modifiedReq).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const token = (event.body as { token?: string })?.token;
          if (token) {
            try {
              localStorage.setItem('token', token);
            } catch (e) {
              // Handle error silently
            }
          }
        }
      },
      error: (err) => {
        // Handle error silently
      },
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.handleTokenExpiration();
      }
      return throwError(error);
    })
  );
};
