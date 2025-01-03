import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    if (authToken) {
      // Füge den Authorization-Header hinzu
      request = request.clone({
        setHeaders: {
          Authorization: `Token ${authToken}`,
        },
      });
    }
    return next.handle(request);
  }
}
