import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private apiUrl = 'http://127.0.0.1:8000/kanban/';
  // private apiUrl = 'http://127.0.0.1:8000/';
  private tasksCache$: Observable<any>;
  private usersCache$: Observable<any>;
  private subtasksCache$: Observable<any>;

  constructor(private http: HttpClient) { }

  // Methode zum Abrufen von Tasks
  getTasks(): Observable<any> {
    if (!this.tasksCache$) {
      this.tasksCache$ = this.http.get(`${this.apiUrl}tasks/`).pipe(
        shareReplay(1) // Zwischenspeichern der Daten
      );
    }
    return this.tasksCache$;
  }

  // Methode zum Abrufen von Users
  getUsers(): Observable<any> {
    if (!this.usersCache$) {
      this.usersCache$ = this.http.get(`${this.apiUrl}users/`).pipe(
        shareReplay(1) // Zwischenspeichern der Daten
      );
    }
    return this.usersCache$;
  }

  // Methode zum Abrufen von Subtasks
  getSubtasks(): Observable<any> {
    if (!this.subtasksCache$) {
      this.subtasksCache$ = this.http.get(`${this.apiUrl}subtasks/`).pipe(
        shareReplay(1) // Zwischenspeichern der Daten
      );
    }
    return this.subtasksCache$;
  }

  // Methode zum Senden von Daten (z.B. für Tasks)
  createItem(item: any, endpoint: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}${endpoint}/`, item, { headers: headers }).pipe(
      tap(() => {
        // Nach dem Erstellen eines neuen Items, das Cache leeren
        this.clearCache(endpoint);
      })
    );
  }

  // Methode zum Aktualisieren von Daten (z.B. für Tasks)
  updateItem(item: any, endpoint: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}${endpoint}/${item.id}/`, item, { headers: headers }).pipe(
      tap(() => {
        // Nach dem Aktualisieren eines Items, das Cache leeren
        this.clearCache(endpoint);
      })
    );
  }

  // Methode zum Löschen von Daten (z.B. für Tasks)
  deleteItem(id: number, endpoint: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${endpoint}/${id}/`).pipe(
      tap(() => {
        // Nach dem Löschen eines Items, das Cache leeren
        this.clearCache(endpoint);
      })
    );
  }

  // Hilfsmethode zum Leeren des Caches basierend auf dem Endpunkt
  private clearCache(endpoint: string): void {
    switch (endpoint) {
      case 'tasks':
        this.tasksCache$ = null;
        break;
      case 'users':
        this.usersCache$ = null;
        break;
      case 'subtasks':
        this.subtasksCache$ = null;
        break;
      default:
        break;
    }
  }

  updateTaskPositionsBatch(data: { id: number; position: number }[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}tasks/update_positions/`, data, { headers: headers }).pipe(
      tap(() => {
        // Nach dem Batch-Update das Cache für Tasks leeren
        this.clearCache('tasks');
      })
    );
  }  
}