import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/AuthService';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  let clonedReq = req;
  if (token) {
    clonedReq = addTokenHeader(req, token);
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 && 
        !req.url.includes('/auth/login') && 
        !req.url.includes('/auth/refresh')
      ) {
        return handle401Error(req, next, authService, router);
      }

      return throwError(() => error);
    })
  );
};

function addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
  const tokenType = localStorage.getItem('tokenType') || 'Bearer';
  return request.clone({
    setHeaders: { Authorization: `${tokenType} ${token}` }
  });
}

function handle401Error(
  request: HttpRequest<any>, 
  next: HttpHandlerFn, 
  authService: AuthService, 
  router: Router
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (!storedRefreshToken) {
      isRefreshing = false;
      localStorage.clear();
      router.navigate(['/login']);
      return throwError(() => new Error('No refresh token available'));
    }

    return authService.refreshToken({ refreshToken: storedRefreshToken }).pipe(
      switchMap((response) => {
        isRefreshing = false;
        
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        if (response.type) {
          localStorage.setItem('tokenType', response.type);
        }

        refreshTokenSubject.next(response.token);
        return next(addTokenHeader(request, response.token));
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        localStorage.clear();
        router.navigate(['/login']);
        return throwError(() => refreshError);
      })
    );

  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(addTokenHeader(request, token!));
      })
    );
  }
}