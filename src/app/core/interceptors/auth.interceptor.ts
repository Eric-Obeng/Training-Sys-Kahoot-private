import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');

  // Add Authorization header if token exists
  const modifiedReq = req.clone({
    headers: req.headers
      .set('ngrok-skip-browser-warning', '69420') // Add ngrok header
      .set('Authorization', token ? `Bearer ${token}` : ''),
  });

  // Skip token refresh logic for login URL
  if (!req.url.includes('/login')) {
    return next(modifiedReq);
  }

  // Add token persistence logic for login endpoint responses
  return next(modifiedReq).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const token = (event.body as { token?: string })?.token;
          if (token) {
            try {
              localStorage.setItem('token', token);
            } catch (e) {
              console.error('Failed to store token:', e);
            }
          }
        }
      },
      error: (err) => {
        console.error('Error in response:', err);
      },
    })
  );
};
