import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskDetailsCommService } from '../services/task-details-comm.service';

@Component({
  selector: 'app-main-dialog-task-details-and-edit',
  templateUrl: './main-dialog-task-details-and-edit.component.html',
  styleUrls: ['./main-dialog-task-details-and-edit.component.scss']
})
export class MainDialogTaskDetailsAndEditComponent {

  editMode: boolean = false;
  private subscriptionEditMode: Subscription;

  taskData;

  constructor(private taskDetailsCommService: TaskDetailsCommService) {
    this.subscriptionEditMode = this.taskDetailsCommService.editMode$.subscribe(value => {
      this.editMode = value;
    });
  }

  ngOnDestroy() {
    if (this.subscriptionEditMode) {
      this.subscriptionEditMode.unsubscribe();
    }
  }
}
