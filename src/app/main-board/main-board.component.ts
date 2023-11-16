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
import { TaskDataService } from '../services/task-data.service';

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
  awaitfeedback = [];
  done = [];

  subTasksComplete;
  subTasksAmount;

  dragActive: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkForHorizontalScroll();
  }

  @ViewChild('mainContainer') mainContainer: ElementRef;
  @ViewChildren('sectionBody') sectionBodys: QueryList<ElementRef>;

  @ViewChild('searchBar') searchBar: ElementRef;
  @ViewChildren('taskCard') taskCards: QueryList<ElementRef>;

  displayDeletionAnimation: boolean = false;

  constructor(
    private firestore: AngularFirestore,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    public boardCommService: BoardCommService,
    public taskDataService: TaskDataService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && event.id === 1) {
        this.onBrowserRefresh();
      }
    });
  }

  ngOnInit(): void {
    this.allTasksData = this.taskDataService.allTasksData;
    this.allUsersData = this.userService.allUsersData;
    this.convertTasksDataToLists();
    this.sortTasksInColumns();
    this.renumberTasksColumnOrder();
    this.backendTasksColumnOrder();
    this.boardCommService.reloadAfterNewTask = this.reloadAfterNewTask.bind(this);
    this.boardCommService.setNewTasksDataToLocal = this.setNewTasksDataToLocal.bind(this);
    this.boardCommService.updateSingleTaskVar = this.updateSingleTaskVar.bind(this);
    this.boardCommService.deleteTask = this.deleteTask.bind(this);
  }

  reloadAfterNewTask() {
    this.allTasksData = this.taskDataService.allTasksData;
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
  }

  searchTasks() {
    const searchTerm = this.searchBar.nativeElement.value.toLowerCase();
    if (searchTerm !== "") {
      this.taskCards.forEach((taskCard: ElementRef) => {
        taskCard.nativeElement.classList.add("d-none");
      });
      this.displaySearchResults(searchTerm);
    } else {
      this.taskCards.forEach((taskCard: ElementRef) => {
        taskCard.nativeElement.classList.remove("d-none");
      });
    }
  }

  resetSearchFunction() {
    this.searchBar.nativeElement.value = '';
    this.taskCards.forEach((taskCard: ElementRef) => {
      taskCard.nativeElement.classList.remove('d-none');
    });
  }

  displaySearchResults(searchTerm) {
    this.taskCards.forEach((taskCard: ElementRef) => {
      this.taskCards.forEach((taskCard: ElementRef) => {
        const title = taskCard.nativeElement.querySelector('.task__title').innerText.toLowerCase();
        const description = taskCard.nativeElement.querySelector('.task__description').innerText.toLowerCase();
    
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          taskCard.nativeElement.classList.remove('d-none');
        }
      });
    })
  }

  openAddTaskDialog(taskStatus) {
    // this.saveBoardStatus();
    // this.updateTasksStatus();
    const dialogRef = this.dialog.open(MainDialogAddTaskComponent, {
      panelClass: 'popup__task__add',
      data: { taskStatus: taskStatus }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.allUsersData = this.userService.allUsersData;
      // this.allTasksData = this.userService.allTasksData;
      // this.convertTasksDataToLists();
      // this.sortTasksInColumns();
    });
  }

  convertTasksDataToLists() {
    this.todo = [];
    this.inprogress = [];
    this.awaitfeedback = [];
    this.done = [];
    this.allTasksData.forEach(task => {
      switch (task.taskStatus) {
        case "todo":
          this.todo.push(task);
          break;
        case "inprogress":
          this.inprogress.push(task);
          break;
        case "awaitfeedback":
          this.awaitfeedback.push(task);
          break;
        case "done":
          this.done.push(task);
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
    this.awaitfeedback.sort(customSort);
    this.done.sort(customSort);
  }

  determineSubtaskProgress(subTasksCompleted) {
    const subTaskCount = subTasksCompleted.length;
    const trueCount = subTasksCompleted.filter(Boolean).length;
    if (trueCount === 0) {
      return 'empty';
    } else if (subTaskCount === trueCount) {
      return 'full';
    } else {
      return 'half';
    }
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
    this.resetSearchFunction();
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
    this.renumberTasksColumnOrderForList(this.awaitfeedback, "awaitfeedback");
    this.renumberTasksColumnOrderForList(this.done, "done");
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
    const newAllTasksData = [
      ...this.todo,
      ...this.inprogress,
      ...this.awaitfeedback,
      ...this.done
    ];
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

    for (let index = 0; index < this.awaitfeedback.length; index++) {
      const element = this.awaitfeedback[index];
      this.firestore
        .collection('tasks')
        .doc(element.firebaseId)
        .update(element);
    }

    for (let index = 0; index < this.done.length; index++) {
      const element = this.done[index];
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
      panelClass: 'popup__task__details',
      autoFocus: false
    });
    dialogRef.componentInstance.taskData = { ...taskData };
    dialogRef.afterClosed().subscribe((result) => {
      if (this.boardCommService.subTaskCompletedChange) {
        this.updateSingleTaskVar();
        // this.reloadAfterNewTask();
        this.setNewTasksDataToLocal();
        this.updateSingleTaskBackend();
        this.boardCommService.subTaskCompletedChange = false;
      }
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
    localStorage.removeItem('allTasksData');
    localStorage.setItem('allTasksData', JSON.stringify(this.allTasksData));
  }

  updateSingleTaskBackend() {
    const updatedTaskData = this.boardCommService.updatedTaskData;
    this.firestore
      .collection('tasks')
      .doc(updatedTaskData.firebaseId)
      .update(updatedTaskData);
  }

  async deleteTask() {
    this.displayDeletionSuccessfulAnimation();
    const taskToDelete = this.boardCommService.taskToDelete;
    for (let index = 0; index < this.allTasksData.length; index++) {
      const element = this.allTasksData[index];
      if (element.firebaseId === taskToDelete.firebaseId) {
        this.allTasksData.splice(index, 1);
        try {
          await this.firestore
            .collection('tasks')
            .doc(element.firebaseId)
            .delete();

          this.reloadAfterNewTask();
          this.setNewTasksDataToLocal();
        } catch {
          console.error("Error deleting document: ", Error);
        }
      }
    }
  }

  displayDeletionSuccessfulAnimation() {
    this.displayDeletionAnimation = true;
    setTimeout(() => {
      this.displayDeletionAnimation = false;
    }, 1500);
  }
}
