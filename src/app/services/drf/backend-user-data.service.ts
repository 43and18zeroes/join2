import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendUserDataService {

  userAddedSuccessfully = false;
  lastUserAdded: Object;
  lastUserAddedId: string;

  constructor(private http: HttpClient) {}

  getUserData(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.get(`http://127.0.0.1:8000/auth/current-user/`, { headers });
  }

}
