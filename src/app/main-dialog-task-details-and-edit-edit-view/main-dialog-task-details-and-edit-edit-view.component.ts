import { Component } from '@angular/core';
import { TaskDetailsCommService } from '../services/task-details-comm.service';
import { MainDialogTaskDetailsAndEditComponent } from '../main-dialog-task-details-and-edit/main-dialog-task-details-and-edit.component';
import { FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-main-dialog-task-details-and-edit-edit-view',
  templateUrl: './main-dialog-task-details-and-edit-edit-view.component.html',
  styleUrls: ['./main-dialog-task-details-and-edit-edit-view.component.scss']
})
export class MainDialogTaskDetailsAndEditEditViewComponent {

  taskData;
  updatedTaskData;
  editTaskForm = this.fb.group({
    // category: [''],
    title: [''],
    // desciption: [''],
    // dueDate: [''],
    // priority: [''],
    // assignedTo: [[]],
    // subTasks: [],
    // subTasksCompleted: []
  });

  constructor(private taskDetailsCommService: TaskDetailsCommService,
    public mainDialogTaskDetailsAndEditComponent: MainDialogTaskDetailsAndEditComponent,
    private fb: FormBuilder,
    private firestore: AngularFirestore) { }

  ngOnInit() {
    this.taskData = this.mainDialogTaskDetailsAndEditComponent.taskData;
    console.log("this.taskData", this.taskData);
  }

  onSubmit() {
    this.updateTask();
    // Update Successful Animation
    this.taskDetailsCommService.unsetEditMode();
  }

  updateTask() {
    this.firestore
      .collection('tasks')
      // .doc(updatedUser.firebaseId)
      // .update(updatedUser);
  }
}
