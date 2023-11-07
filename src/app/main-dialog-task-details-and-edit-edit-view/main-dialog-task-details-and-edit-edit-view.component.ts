import { Component } from '@angular/core';
import { TaskDetailsCommService } from '../services/task-details-comm.service';
import { MainDialogTaskDetailsAndEditComponent } from '../main-dialog-task-details-and-edit/main-dialog-task-details-and-edit.component';
import { FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BoardCommService } from '../services/board-comm.service';

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

  constructor(
    private taskDetailsCommService: TaskDetailsCommService,
    public mainDialogTaskDetailsAndEditComponent: MainDialogTaskDetailsAndEditComponent,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    public boardCommService: BoardCommService
  ) { }

  ngOnInit() {
    this.taskData = this.mainDialogTaskDetailsAndEditComponent.taskData;
    this.updatedTaskData = this.mainDialogTaskDetailsAndEditComponent.taskData;
  }

  onSubmit() {
    this.updatedTaskData.title = this.taskData.title;
    this.updateTask();
    // Update Successful Animation
    
    setTimeout(() => {
      this.taskDetailsCommService.unsetEditMode();
      this.boardCommService.reloadAfterNewTask();
      this.boardCommService.setNewTasksDataToLocal();
    }, 1500);
  }

  updateTask() {
    console.log("this.updatedTaskData", this.updatedTaskData)
    this.firestore
      .collection('tasks')
      .doc(this.updatedTaskData.firebaseId)
      .update(this.updatedTaskData);
  }
}
