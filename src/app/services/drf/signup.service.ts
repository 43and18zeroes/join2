import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class SignupService {

  constructor(private http: HttpClient) {}

  private apiUrl = "http://127.0.0.1:8000/";
  private usersCache$: Observable<any>;

  createItem(item: any, endpoint: string): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(`${this.apiUrl}${endpoint}/`, item, { headers: headers }).pipe(
      tap(() => {
        // Nach dem Erstellen eines neuen Items, das Cache leeren
        this.usersCache$ = null;
      })
    );
  }
}
