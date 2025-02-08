import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ErrorHelper } from '../helpers';
import { AuthBaseStore } from '../states';
import { SnackbarService } from '../../shared';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly auth = inject(AuthBaseStore);
  private readonly snackbar = inject(SnackbarService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((e: any) => {
        if (e.status === 401) {
          this.auth.logout(true);
        }
        this.snackbar.showServerError(e.status, ErrorHelper.parseApiErrorObject(e.error));
        return throwError(() => e);
      }),
    );
  }
}
