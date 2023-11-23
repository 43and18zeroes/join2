import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoardCommService {

  updatedTaskData;
  taskToDelete;
  subTaskCompletedChange: boolean = false;
  subTasksNew;

  constructor() { }

  public reloadAfterNewTask(): void {

  }

  public setNewTasksDataToLocal(): void {

  }

  public updateSingleTaskVar(): void {

  }

  public deleteTask(): void {

  }
}
