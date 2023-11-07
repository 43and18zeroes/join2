import { Component } from '@angular/core';
import { TaskDetailsCommService } from '../services/task-details-comm.service';
import { MainDialogTaskDetailsAndEditComponent } from '../main-dialog-task-details-and-edit/main-dialog-task-details-and-edit.component';
import { BoardCommService } from '../services/board-comm.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main-dialog-task-details-and-edit-task-view',
  templateUrl: './main-dialog-task-details-and-edit-task-view.component.html',
  styleUrls: ['./main-dialog-task-details-and-edit-task-view.component.scss']
})
export class MainDialogTaskDetailsAndEditTaskViewComponent {

  taskData;

  constructor(private taskDetailsCommService: TaskDetailsCommService,
              public mainDialogTaskDetailsAndEditComponent: MainDialogTaskDetailsAndEditComponent,
              public boardCommService: BoardCommService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.taskData = this.mainDialogTaskDetailsAndEditComponent.taskData;
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  setEditMode() {
    this.taskDetailsCommService.setEditMode();
  }

  deleteTask() {
    this.boardCommService.taskToDelete = this.taskData;
    this.boardCommService.deleteTask();
  }
}
