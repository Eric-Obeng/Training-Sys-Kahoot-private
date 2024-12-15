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

  const modifiedReq = req.clone({
    headers: req.headers
      .set('ngrok-skip-browser-warning', '69420')
      .set('Authorization', token ? `Bearer ${token}` : ''),
  });

  if (!req.url.includes('/login')) {
    return next(modifiedReq);
  }

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
