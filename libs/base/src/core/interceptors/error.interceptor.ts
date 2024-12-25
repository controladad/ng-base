import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthStore } from '../states';
import { ErrorHelper } from '../helpers';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private auth: AuthStore) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((e: any) => {
        if (e.status === 401) {
          this.auth.logout(true);
        }
        snackbar$.showServerError(e.status, ErrorHelper.parseApiErrorObject(e.error));
        return throwError(() => e);
      }),
    );
  }
}
