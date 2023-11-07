import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoardCommService {

  updatedTaskData;

  constructor() { }

  public reloadAfterNewTask(): void {
    console.log('Diese Funktion wurde über den SharedService aufgerufen');
  }

  public setNewTasksDataToLocal(): void {
    console.log('Diese Funktion wurde über den SharedService aufgerufen');
  }

  public updateSingleTaskVar(): void {
    console.log('Diese Funktion wurde über den SharedService aufgerufen');
  }
}
