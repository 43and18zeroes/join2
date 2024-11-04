import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private apiUrl = 'http://127.0.0.1:8000/kanban/';
  private itemsCache$: Observable<any>;

  constructor(private http: HttpClient) { }

  // Beispielmethode zum Abrufen von Daten
  getItems(): Observable<any> {
    if (!this.itemsCache$) {
      this.itemsCache$ = this.http.get(`${this.apiUrl}tasks/`).pipe(
        shareReplay(1) // Zwischenspeichern der Daten
      );
    }
    return this.itemsCache$;
  }

  // Beispielmethode zum Senden von Daten
  createItem(item: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}items/`, item, { headers: headers }).pipe(
      tap(() => {
        // Nach dem Erstellen eines neuen Items, das Cache leeren
        this.itemsCache$ = null;
      })
    );
  }

  // Beispielmethode zum Aktualisieren von Daten
  updateItem(item: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}items/${item.id}/`, item, { headers: headers }).pipe(
      tap(() => {
        // Nach dem Aktualisieren eines Items, das Cache leeren
        this.itemsCache$ = null;
      })
    );
  }

  // Beispielmethode zum Löschen von Daten
  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}items/${id}/`).pipe(
      tap(() => {
        // Nach dem Löschen eines Items, das Cache leeren
        this.itemsCache$ = null;
      })
    );
  }
}