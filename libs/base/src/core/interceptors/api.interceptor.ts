import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASEURL } from '../../configs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  readonly apiBaseUrl = inject(API_BASEURL);

  // using inject() causes circular error, idk why...
  // readonly apiBaseUrl = inject(API_BASEURL);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      url: request.url.startsWith('/') ? this.apiBaseUrl + request.url : request.url,
    });
    return next.handle(request);
  }
}
