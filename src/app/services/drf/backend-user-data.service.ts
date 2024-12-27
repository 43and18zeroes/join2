import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendUserDataService {
  private userDataSubject = new BehaviorSubject<any>(null);
  userAddedSuccessfully = false;
  lastUserAdded: Object;
  lastUserAddedId: string;
  private userData: any = null;
  private usersCache$: Observable<any>;
  private apiUrl = 'http://127.0.0.1:8000/auth/';

  constructor(private http: HttpClient) {}

  getUserData(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.get(`${this.apiUrl}current-user/`, { headers });
  }

  setUserData(data: any) {
    this.userDataSubject.next(data); // Wert im Subject setzen
  }

  getUserDataObservable(): Observable<any> {
    return this.userDataSubject.asObservable(); // Observable für Abonnements
  }

  getUsers(): Observable<any> {
    if (!this.usersCache$) {
      this.usersCache$ = this.http.get(`${this.apiUrl}profiles/`).pipe(
        shareReplay(1) // Zwischenspeichern der Daten
      );
    }
    return this.usersCache$;
  }

  // private clearCache(endpoint: string): void {
  //   switch (endpoint) {
  //     case 'users':
  //       this.usersCache$ = null;
  //       break;
  //     default:
  //       break;
  //   }
  // }
}
