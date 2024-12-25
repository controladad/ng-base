import { Inject, inject, Injectable, Optional } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASEURL, ENVIRONMENT } from '../../tokens';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  readonly environment = inject(ENVIRONMENT);

  // using inject() causes circular error, idk why...
  // readonly apiBaseUrl = inject(API_BASEURL);

  constructor(@Optional() @Inject(API_BASEURL) private apiBaseUrl: string) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      url: request.url.startsWith('/')
        ? (this.apiBaseUrl && this.apiBaseUrl !== '' ? this.apiBaseUrl : this.environment.apiBaseUrl) + request.url
        : request.url,
    });
    return next.handle(request);
  }
}
