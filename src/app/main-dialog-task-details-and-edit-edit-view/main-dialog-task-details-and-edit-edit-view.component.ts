import { Component } from '@angular/core';
import { TaskDetailsCommService } from '../services/task-details-comm.service';
import { MainDialogTaskDetailsAndEditComponent } from '../main-dialog-task-details-and-edit/main-dialog-task-details-and-edit.component';

@Component({
  selector: 'app-main-dialog-task-details-and-edit-edit-view',
  templateUrl: './main-dialog-task-details-and-edit-edit-view.component.html',
  styleUrls: ['./main-dialog-task-details-and-edit-edit-view.component.scss']
})
export class MainDialogTaskDetailsAndEditEditViewComponent {

  taskData;

  constructor(private taskDetailsCommService: TaskDetailsCommService,
              public mainDialogTaskDetailsAndEditComponent: MainDialogTaskDetailsAndEditComponent) { }

  ngOnInit() {
    this.taskData = this.mainDialogTaskDetailsAndEditComponent.taskData;
    console.log("this.taskData", this.taskData);
  }

  submitChanges() {
    // Update changes
    // Update Successful Animation
    this.taskDetailsCommService.unsetEditMode();
  }
}
