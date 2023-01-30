import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  public constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const headerName = 'X-XSRF-TOKEN';
    const token = this.tokenExtractor.getToken();

    if (token !== null && !request.headers.has(headerName)) {
      request = request.clone({
        headers: request.headers.set(headerName, token),
      });
    }
    return next.handle(request);
  }
}
