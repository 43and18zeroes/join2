import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  // URL deines DRF-Backends
  private apiUrl = 'http://127.0.0.1:8000/kanban/';

  constructor(private http: HttpClient) { }

  // Beispielmethode zum Abrufen von Daten
  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}tasks/`);
  }

  // Beispielmethode zum Senden von Daten
  createItem(item: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}items/`, item, { headers: headers });
  }

  // Beispielmethode zum Aktualisieren von Daten
  updateItem(item: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}items/${item.id}/`, item, { headers: headers });
  }

  // Beispielmethode zum Löschen von Daten
  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}items/${id}/`);
  }
}