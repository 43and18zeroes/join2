import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/auth/login/'; // Endpoint für Login

  constructor(private http: HttpClient) {}

  // Methode für den Login
  signIn(userData: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }

  logOut(): Observable<any> {
    // const authToken = localStorage.getItem("authToken");

    // if (this.logoutUrl) {
    //   // Backend-Logout
    //   return this.http.post<any>(this.logoutUrl, {}, {
    //     headers: { Authorization: `Bearer ${authToken}` }
    //   });
    // }

    // Clientseitiger Logout
    localStorage.removeItem("authToken");
    return of({ success: true }); // Gibt ein Observable zurück
  }
}
