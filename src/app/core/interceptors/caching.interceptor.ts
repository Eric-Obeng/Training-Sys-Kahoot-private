import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

const cache = new Map<string, any>();

/**
 * Creates a unique cache key based on the URL and query parameters.
 */
function getCacheKey(req: HttpRequest<any>): string {
  const { url, params } = req;
  return `${url}?${params.toString()}`;
}

export const cachingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const cacheKey = getCacheKey(req);

  if (req.method === 'GET') {
    // Return cached response if it exists
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      return of(new HttpResponse({ body: cachedResponse }));
    }

    // Proceed with the request and cache the response
    return next(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.status === 200) {
          cache.set(cacheKey, event.body); // Cache only successful GET responses
        }
      })
    );
  } else if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    // Clear the entire cache on successful POST, PUT, or DELETE
    return next(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.status >= 200 && event.status < 300) {
          cache.clear(); // Clear the entire cache when a modifying request succeeds
        }
      })
    );
  }

  // Default behavior for other HTTP methods
  return next(req);
};
