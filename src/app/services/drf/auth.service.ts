import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getUserData(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.get(`http://127.0.0.1:8000/auth/current-user/`, { headers });
  }
}
