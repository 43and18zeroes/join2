import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDragStart } from '@angular/cdk/drag-drop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../services/user-data.service';
import { Router, NavigationStart } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MainAddTaskComponent } from '../main-add-task/main-add-task.component';
import { MainDialogAddTaskComponent } from '../main-dialog-add-task/main-dialog-add-task.component';
import { MainDialogTaskDetailsAndEditComponent } from '../main-dialog-task-details-and-edit/main-dialog-task-details-and-edit.component';
import { BoardCommService } from '../services/board-comm.service';

@Component({
  selector: 'app-main-board',
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss']
})
export class MainBoardComponent {

  allTasksData;
  allUsersData;

  todo = [];
  inprogress = [];
  awaitfeedback = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  subTasksComplete;
  subTasksAmount;

  dragActive: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkForHorizontalScroll();
  }

  @ViewChild('mainContainer') mainContainer: ElementRef;
  @ViewChildren('sectionBody') sectionBodys: QueryList<ElementRef>;

  constructor(
    private firestore: AngularFirestore,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    public boardCommService: BoardCommService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && event.id === 1) {
        this.onBrowserRefresh();
      }
    });
  }

  ngOnInit(): void {
    this.allTasksData = this.userService.allTasksData;
    this.allUsersData = this.userService.allUsersData;
    this.convertTasksDataToLists();
    this.sortTasksInColumns();
    this.renumberTasksColumnOrder();
    this.backendTasksColumnOrder();
    this.boardCommService.reloadAfterNewTask = this.reloadAfterNewTask.bind(this);
    this.boardCommService.setNewTasksDataToLocal = this.setNewTasksDataToLocal.bind(this);
    this.boardCommService.updateSingleTaskVar = this.updateSingleTaskVar.bind(this);
    this.boardCommService.deleteTask = this.deleteTask.bind(this);
    // this.openTaskDetails(this.todo[0])
  }

  reloadAfterNewTask() {
    this.allTasksData = this.userService.allTasksData;
    this.convertTasksDataToLists();
    this.sortTasksInColumns();
    this.renumberTasksColumnOrder();
    this.backendTasksColumnOrder();
  }

  onBrowserRefresh() {
    this.allTasksData = JSON.parse(localStorage.getItem('allTasksData') || '[]');
  }

  ngAfterViewInit() {
    this.checkForHorizontalScroll();
    // this.saveBoardStatus();
  }

  openAddTaskDialog(taskStatus) {
    // this.saveBoardStatus();
    // this.updateTasksStatus();
    const dialogRef = this.dialog.open(MainDialogAddTaskComponent, {
      panelClass: 'popup__task__add',
      data: { taskStatus: taskStatus }
    });
    dialogRef.afterClosed().subscribe((result) => {
      // this.allTasksData = this.userService.allTasksData;
      // this.convertTasksDataToLists();
      // this.sortTasksInColumns();
    });
  }

  convertTasksDataToLists() {
    this.todo = [];
    this.inprogress = [];
    this.allTasksData.forEach(task => {
      switch (task.taskStatus) {
        case "todo":
          this.todo.push(task);
          break;
        case "inprogress":
          this.inprogress.push(task);
          break;
      }
    });
  }

  sortTasksInColumns() {
    const customSort = (a, b) => {
      if (a.taskColumnOrder === undefined) return -1;
      if (b.taskColumnOrder === undefined) return 1;
      return a.taskColumnOrder - b.taskColumnOrder;
    };
    this.todo.sort(customSort);
    this.inprogress.sort(customSort);
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

  countSubtasksCompleted(obj: any): number {
    return Object.values(obj).filter(value => value === true).length;
  }

  private checkForHorizontalScroll() {
    const mainElement: HTMLDivElement = this.mainContainer.nativeElement;
    this.sectionBodys.forEach((sectionBody: ElementRef) => {
      const divElement: HTMLDivElement = sectionBody.nativeElement;
      if (mainElement.scrollWidth > mainElement.clientWidth) divElement.classList.add('has__horizontal__scroll');
      else divElement.classList.remove('has__horizontal__scroll');
    });
  }

  onDragStarted(event: CdkDragStart, item: string) {
    this.dragActive = true; // Setzt die Variable auf das aktuelle Element
  }

  drop(event: CdkDragDrop<string[]>) {
    this.dragActive = false;
    if (event.previousContainer === event.container) moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    else transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    this.renumberTasksColumnOrder();
    this.setNewTasksDataToLocal();
    this.backendTasksColumnOrder();
  }

  // saveBoardStatus() {
  // this.updateTasksStatus();
  // this.newAllTasksData = [...this.todo, ...this.inprogress];
  // this.setNewTasksDataToLocal(this.newAllTasksData);
  // this.overwriteAllTasksDataBackend(this.newAllTasksData);
  // }

  renumberTasksColumnOrder() {
    this.renumberTasksColumnOrderForList(this.todo, "todo");
    this.renumberTasksColumnOrderForList(this.inprogress, "inprogress");
  }

  renumberTasksColumnOrderForList(list, status) {
    let taskColumnOrder = 1;
    list.forEach(task => {
      task.taskStatus = status;
      task.taskColumnOrder = taskColumnOrder;
      taskColumnOrder++;
    });
  }

  setNewTasksDataToLocal() {
    const newAllTasksData = [...this.todo, ...this.inprogress];
    localStorage.removeItem('allTasksData');
    localStorage.setItem('allTasksData', JSON.stringify(newAllTasksData));
  }

  backendTasksColumnOrder() {
    for (let index = 0; index < this.todo.length; index++) {
      const element = this.todo[index];
      this.firestore
        .collection('tasks')
        .doc(element.firebaseId)
        .update(element);
    }

    for (let index = 0; index < this.inprogress.length; index++) {
      const element = this.inprogress[index];
      this.firestore
        .collection('tasks')
        .doc(element.firebaseId)
        .update(element);
    }
  }

  // updateTasksStatus() {
  //   this.updateStatusForList(this.todo, "todo");
  //   this.updateStatusForList(this.inprogress, "inprogress");
  // }

  // updateStatusForList(list, status) {
  //   let taskColumnOrder = 1;
  //   list.forEach(task => {
  //     task.taskStatus = status;
  //     task.taskColumnOrder = taskColumnOrder;
  //     taskColumnOrder++;
  //   });
  // }

  // setNewTasksDataToLocal(newAllTasksData) {
  //   localStorage.removeItem('allTasksData');
  //   localStorage.setItem('allTasksData', JSON.stringify(newAllTasksData));
  // }

  // overwriteAllTasksDataBackend(newAllTasksData) {
  //   const tasksCollection = this.firestore.collection('tasks');

  //   // Delete tasks collection backend
  //   tasksCollection.get().toPromise().then(querySnapshot => {
  //     const batch = this.firestore.firestore.batch();
  //     querySnapshot.docs.forEach(doc => {
  //       batch.delete(doc.ref);
  //     });

  //     // Add new tasks
  //     newAllTasksData.forEach(task => {
  //       const docRef = tasksCollection.ref.doc(); // Neue ID für jedes Dokument erstellen
  //       batch.set(docRef, task);
  //     });

  //     // Execute
  //     return batch.commit();
  //   }).then(() => {
  //     console.log('All tasks overwritten successfully');
  //   }).catch(err => {
  //     console.error('Error overwriting tasks: ', err);
  //   });
  // }

  openTaskDetails(taskData) {
    // const clickedContactDataID = clickedContactData.firebaseId;
    const dialogRef = this.dialog.open(MainDialogTaskDetailsAndEditComponent, {
      panelClass: 'popup__task__details'
    });
    dialogRef.componentInstance.taskData = { ...taskData };
    dialogRef.afterClosed().subscribe((result) => {
      // if (this.userService.userDeletedSuccessfully) {
      //   this.showContactDetails = false;
      //   this.displayDeletionSuccessfulAnimation();
      // }
      // if (this.userService.userUpdatedSuccessfully || this.userService.userDeletedSuccessfully) {
      //   this.generateUsersLists();
      //   this.findEditedContactData(clickedContactDataID);
      // }
      // this.userService.userUpdatedSuccessfully = false;
      // this.userService.userDeletedSuccessfully = false;
    });
  }

  updateSingleTaskVar() {
    const updatedTaskData = this.boardCommService.updatedTaskData;
    for (let index = 0; index < this.allTasksData.length; index++) {
      const element = this.allTasksData[index];
      if (element.firebaseId === updatedTaskData.firebaseId) {
        this.allTasksData[index] = updatedTaskData;
        console.log("this.allTasksData[index]", this.allTasksData[index])
      }
    }
  }

  deleteTask() {
    // const array = this.allTasksData;
    // for (let index = 0; index < this.allTasksData.length; index++) {
    //   const element = this.allTasksData[index];
    //   this.firestore
    //     .collection('tasks')
    //     .doc(element.firebaseId)
    //     .delete();
    // }
    const taskToDelete = this.boardCommService.taskToDelete;
    for (let index = 0; index < this.allTasksData.length; index++) {
      const element = this.allTasksData[index];
      if (element.firebaseId === taskToDelete.firebaseId) {
        console.log("deleted:", this.allTasksData[index]);
        this.firestore
          .collection('tasks')
          .doc(this.allTasksData[index].firebaseId)
          .delete();
        this.allTasksData.splice(index, 1);
      }
    }
    this.reloadAfterNewTask();
    this.setNewTasksDataToLocal();
  }
}
