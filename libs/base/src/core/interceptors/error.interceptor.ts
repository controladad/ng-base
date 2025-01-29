import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ErrorHelper } from '../helpers';
import { CacBase } from '../../configs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly auth = inject(CacBase.config.states.auth);

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
