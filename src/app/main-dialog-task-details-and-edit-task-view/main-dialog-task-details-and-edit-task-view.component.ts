import { Component } from '@angular/core';
import { TaskDetailsCommService } from '../services/task-details-comm.service';
import { MainDialogTaskDetailsAndEditComponent } from '../main-dialog-task-details-and-edit/main-dialog-task-details-and-edit.component';

@Component({
  selector: 'app-main-dialog-task-details-and-edit-task-view',
  templateUrl: './main-dialog-task-details-and-edit-task-view.component.html',
  styleUrls: ['./main-dialog-task-details-and-edit-task-view.component.scss']
})
export class MainDialogTaskDetailsAndEditTaskViewComponent {

  taskData;

  constructor(private taskDetailsCommService: TaskDetailsCommService,
              public mainDialogTaskDetailsAndEditComponent: MainDialogTaskDetailsAndEditComponent) {}

  ngOnInit() {
    this.taskData = this.mainDialogTaskDetailsAndEditComponent.taskData;
  }

  setEditMode() {
    this.taskDetailsCommService.setEditMode();
  }
}
