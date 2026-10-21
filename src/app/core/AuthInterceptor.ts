import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');
  
  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
            console.error('Validation Error:', error.error);
        } 
        else if (error.status === 401) {
            console.error('Session expired. Redirecting to login...' ,error.error.message);
        } 
        else if (error.status === 403) {
            console.error('Access Denied! You do not have permission.' ,error.error.message);
        } 
        else if (error.status === 404) {
            console.error('Resource not found.' ,error.error.message);
        } 
        else if (error.status >= 500) {
            console.error('Server is down. Try again later.' ,error.error.message);
        }

      return throwError(() => error);
    })
  );
};