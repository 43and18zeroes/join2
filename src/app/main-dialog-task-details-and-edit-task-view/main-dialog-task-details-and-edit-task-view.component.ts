import { Component } from '@angular/core';
import { TaskDetailsCommService } from '../services/task-details-comm.service';
import { MainDialogTaskDetailsAndEditComponent } from '../main-dialog-task-details-and-edit/main-dialog-task-details-and-edit.component';
import { BoardCommService } from '../services/board-comm.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-dialog-task-details-and-edit-task-view',
  templateUrl: './main-dialog-task-details-and-edit-task-view.component.html',
  styleUrls: ['./main-dialog-task-details-and-edit-task-view.component.scss']
})
export class MainDialogTaskDetailsAndEditTaskViewComponent {

  taskData;
  allUsersData;

  constructor(private taskDetailsCommService: TaskDetailsCommService,
              public mainDialogTaskDetailsAndEditComponent: MainDialogTaskDetailsAndEditComponent,
              public boardCommService: BoardCommService,
              public dialog: MatDialog,
              private userService: UserService) {}

  ngOnInit() {
    this.taskData = this.mainDialogTaskDetailsAndEditComponent.taskData;
    this.allUsersData = this.userService.allUsersData;
    console.log("taskData", this.taskData)
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  getUserColor(assignedUserEmail) {
    for (let index = 0; index < this.allUsersData.length; index++) {
      const element = this.allUsersData[index];
      if (element.userEmailAddress === assignedUserEmail) {
        return element.userColor;
      }
    }
  }

  getUserInitials(assignedUserEmail) {
    for (let index = 0; index < this.allUsersData.length; index++) {
      const element = this.allUsersData[index];
      if (element.userEmailAddress === assignedUserEmail) {
        return element.userInitials;
      }
    }
  }

  getUserName(assignedUserEmail) {
    for (let index = 0; index < this.allUsersData.length; index++) {
      const element = this.allUsersData[index];
      if (element.userEmailAddress === assignedUserEmail) {
        return element.userName;
      }
    }
  }

  assignSelectOption(user: any) {
    // if (user) {
    //   user.selected = !user.selected;
    //   if (user.selected) {
    //     this.selectedUsers.push(user);
    //   } else {
    //     const index = this.selectedUsers.indexOf(user);
    //     if (index !== -1) {
    //       this.selectedUsers.splice(index, 1);
    //     }
    //   }
    // }
    // this.assignSelectedOptionRef.nativeElement.focus();
  }

  toggleSubTask(i) {
    if (this.taskData.subTasksCompleted[i]) {
      this.taskData.subTasksCompleted[i] = false;
    } else {
      this.taskData.subTasksCompleted[i] = true;
    }
    console.log("this.taskData.subTasksCompleted", this.taskData.subTasksCompleted);
  }

  setEditMode() {
    this.taskDetailsCommService.setEditMode();
  }

  deleteTask() {
    this.boardCommService.taskToDelete = this.taskData;
    this.boardCommService.deleteTask();
    this.closeDialog();
  }
}
