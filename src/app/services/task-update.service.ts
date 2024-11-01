import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskUpdateService {
  private apiUrl = 'http://127.0.0.1:8000/kanban/tasks/'; // Passe die URL an

  constructor(private http: HttpClient) {}

  // Methode zum Aktualisieren eines Tasks
  updateTask(id: number, task: any): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.put(url, task);
  }
}