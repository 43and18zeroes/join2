import { Component } from '@angular/core';
import { TaskDetailsCommService } from '../services/task-details-comm.service';

@Component({
  selector: 'app-main-dialog-task-details-and-edit-task-view',
  templateUrl: './main-dialog-task-details-and-edit-task-view.component.html',
  styleUrls: ['./main-dialog-task-details-and-edit-task-view.component.scss']
})
export class MainDialogTaskDetailsAndEditTaskViewComponent {

  constructor(private taskDetailsCommService: TaskDetailsCommService) {}

  setEditMode() {
    this.taskDetailsCommService.setEditMode();
  }
}
