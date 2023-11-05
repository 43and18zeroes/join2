import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskDetailsCommService {

  private editMode = new BehaviorSubject<boolean>(false);
  editMode$ = this.editMode.asObservable();

  constructor() { }

  setEditMode() {
    this.editMode.next(true);
  }

  unsetEditMode() {
    this.editMode.next(false);
  }
}
