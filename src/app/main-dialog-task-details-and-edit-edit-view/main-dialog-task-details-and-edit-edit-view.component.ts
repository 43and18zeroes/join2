import { Component } from '@angular/core';
import { TaskDetailsCommService } from '../task-details-comm.service';

@Component({
  selector: 'app-main-dialog-task-details-and-edit-edit-view',
  templateUrl: './main-dialog-task-details-and-edit-edit-view.component.html',
  styleUrls: ['./main-dialog-task-details-and-edit-edit-view.component.scss']
})
export class MainDialogTaskDetailsAndEditEditViewComponent {

  constructor(private taskDetailsCommService: TaskDetailsCommService) {}

  submitChanges() {
    // Update changes
    // Update Successful Animation
    this.taskDetailsCommService.unsetEditMode();
  }
}
