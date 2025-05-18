import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

export const JWTInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  let token = localStorage.getItem('access_token');
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        authorization: 'Bearer ' + token,
      },
    });
    return next(cloned).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
          console.log(error.status)
          if (error.status == 401 && !req.url.includes("login")) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
          }
          return throwError(() => error);
      })
  );
  } else {
    return next(req).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
          console.log(error.status)
          if (error.status == 401 && !req.url.includes("login")) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
          }
          return throwError(() => error);
      })
  );;
  }
};
