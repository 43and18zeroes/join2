import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDragStart,
  DropListOrientation,
} from "@angular/cdk/drag-drop";
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from "../services/user-data.service";
import { Router, NavigationStart } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MainDialogAddTaskComponent } from "../main-dialog-add-task/main-dialog-add-task.component";
import { MainDialogTaskDetailsAndEditComponent } from "../main-dialog-task-details-and-edit/main-dialog-task-details-and-edit.component";
import { BoardCommService } from "../services/board-comm.service";
import { TaskDataService } from "../services/task-data.service";
import { BackendService } from "../services/drf/backend-service.service";

@Component({
  selector: "app-main-board",
  templateUrl: "./main-board.component.html",
  styleUrls: ["./main-board.component.scss"],
})
export class MainBoardComponent {
  @ViewChild("mainContainer") mainContainer: ElementRef;
  @ViewChildren("sectionBody") sectionBodys: QueryList<ElementRef>;
  @ViewChild("searchBar") searchBar: ElementRef;
  @ViewChildren("taskCard") taskCards: QueryList<ElementRef>;

  dropListOrienatation: DropListOrientation;
  dragDelay: number;
  allTasksData;
  allUsersData;
  todo = [];
  inprogress = [];
  awaitfeedback = [];
  done = [];
  subTasksComplete;
  subTasksAmount;
  dragActive: boolean = false;
  displayDeletionAnimation: boolean = false;
  // items: any[] = [];

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.checkForHorizontalScroll();
    this.dropListOrientation();
    this.determineDragDelay();
  }

  constructor(
    // private firestore: AngularFirestore,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    public boardCommService: BoardCommService,
    public taskDataService: TaskDataService,
    private backendService: BackendService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && event.id === 1) {
        this.onBrowserRefresh();
      }
    });
  }

  ngOnInit(): void {
    // this.taskDataService.getTasksDataMain();
    this.getTasksData();
    // this.allTasksData = this.taskDataService.allTasksData;
    this.allUsersData = this.userService.allUsersData;
    this.boardCommService.reloadAfterNewTask = this.reloadAfterNewTask.bind(this);
    this.boardCommService.setNewTasksDataToLocal = this.setNewTasksDataToLocal.bind(this);
    // this.boardCommService.updateSingleTaskVar = this.updateSingleTaskVar.bind(this);
    this.boardCommService.deleteTask = this.deleteTask.bind(this);
    this.dropListOrientation();
    this.determineDragDelay();
  }

  getTasksData() {
    this.backendService.getTasks().subscribe((data) => {
      this.allTasksData = data;
      this.convertTasksDataToLists();
      this.sortTasksInColumns();
      this.renumberTasksColumnOrder();
      this.backendTasksColumnOrder();
      console.log('data', this.allTasksData);
    });
  }

  reloadAfterNewTask() {
    this.backendService.getTasks().subscribe((data) => {
      this.allTasksData = data;
      this.convertTasksDataToLists();
      this.sortTasksInColumns();
      this.renumberTasksColumnOrder();
      this.backendTasksColumnOrder();
    });
    // this.allTasksData = this.taskDataService.allTasksData;
    // this.convertTasksDataToLists();
    // this.sortTasksInColumns();
    // this.renumberTasksColumnOrder();
    // this.backendTasksColumnOrder();
  }

  onBrowserRefresh() {
    this.allTasksData = JSON.parse(localStorage.getItem("allTasksData") || "[]");
  }

  ngAfterViewInit() {
    this.checkForHorizontalScroll();
  }

  dropListOrientation() {
    if (window.innerWidth <= 992) this.dropListOrienatation = "horizontal";
    else this.dropListOrienatation = "vertical";
  }

  determineDragDelay() {
    if (window.innerWidth <= 992) this.dragDelay = 500;
    else this.dragDelay = 0;
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
    this.searchBar.nativeElement.value = "";
    this.taskCards.forEach((taskCard: ElementRef) => {
      taskCard.nativeElement.classList.remove("d-none");
    });
  }

  displaySearchResults(searchTerm) {
    this.taskCards.forEach((taskCard: ElementRef) => {
      this.taskCards.forEach((taskCard: ElementRef) => {
        const title = taskCard.nativeElement.querySelector(".task__title").innerText.toLowerCase();
        const description = taskCard.nativeElement.querySelector(".task__description").innerText.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          taskCard.nativeElement.classList.remove("d-none");
        }
      });
    });
  }

  openAddTaskDialog(taskStatus) {
    const dialogRef = this.dialog.open(MainDialogAddTaskComponent, {
      panelClass: "popup__task__add",
      data: { taskStatus: taskStatus },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.allUsersData = this.userService.allUsersData;
      this.resetSearchFunction();
    });
  }

  convertTasksDataToLists() {
    this.clearTaskLists();
    this.determineTaskStatus();
  }

  clearTaskLists() {
    this.todo = [];
    this.inprogress = [];
    this.awaitfeedback = [];
    this.done = [];
  }

  determineTaskStatus() {
    this.allTasksData.forEach((task) => {
      switch (task.status) {
        case "todo":
          this.todo.push(task);
          break;
        case "in_progress":
          this.inprogress.push(task);
          break;
        case "await_feedback":
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
      if (a.position === undefined) return -1;
      if (b.position === undefined) return 1;
      return a.position - b.position;
    };
    this.todo.sort(customSort);
    this.inprogress.sort(customSort);
    this.awaitfeedback.sort(customSort);
    this.done.sort(customSort);
  }

  // determineSubtaskProgress(subTasksCompleted) {
  //   const subTaskCount = subTasksCompleted.length;
  //   const trueCount = subTasksCompleted.filter(Boolean).length;
  //   if (trueCount === 0) {
  //     return 'empty';
  //   } else if (subTaskCount === trueCount) {
  //     return 'full';
  //   } else {
  //     return 'half';
  //   }
  // }

  // getUserColor(assignedUserEmail) {
  //   for (let index = 0; index < this.allUsersData.length; index++) {
  //     const element = this.allUsersData[index];
  //     if (element.userEmailAddress === assignedUserEmail) {
  //       return element.userColor;
  //     }
  //   }
  // }

  // getUserInitials(assignedUserEmail) {
  //   for (let index = 0; index < this.allUsersData.length; index++) {
  //     const element = this.allUsersData[index];
  //     if (element.userEmailAddress === assignedUserEmail) {
  //       return element.userInitials;
  //     }
  //   }
  // }

  // countSubtasksCompleted(obj: any): number {
  //   return Object.values(obj).filter(value => value === true).length;
  // }

  private checkForHorizontalScroll() {
    const mainElement: HTMLDivElement = this.mainContainer.nativeElement;
    this.sectionBodys.forEach((sectionBody: ElementRef) => {
      const divElement: HTMLDivElement = sectionBody.nativeElement;
      if (mainElement.scrollWidth > mainElement.clientWidth) divElement.classList.add("has__horizontal__scroll");
      else divElement.classList.remove("has__horizontal__scroll");
    });
  }

  onDragStarted(event: CdkDragStart, item: string) {
    this.dragActive = true;
    this.resetSearchFunction();
  }

  drop(event: CdkDragDrop<string[]>) {
    this.dragActive = false;
    if (event.previousContainer === event.container)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    else transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    this.renumberTasksColumnOrder();
    this.setNewTasksDataToLocal();
    this.backendTasksColumnOrder();
  }

  renumberTasksColumnOrder() {
    this.renumberTasksColumnOrderForList(this.todo, "todo");
    this.renumberTasksColumnOrderForList(this.inprogress, "in_progress");
    this.renumberTasksColumnOrderForList(this.awaitfeedback, "await_feedback");
    this.renumberTasksColumnOrderForList(this.done, "done");
  }

  renumberTasksColumnOrderForList(list, status) {
    let position = 1;
    list.forEach((task) => {
      task.status = status;
      task.position = position;
      position++;
    });
  }

  setNewTasksDataToLocal() {
    const newAllTasksData = [...this.todo, ...this.inprogress, ...this.awaitfeedback, ...this.done];
    localStorage.removeItem("allTasksData");
    localStorage.setItem("allTasksData", JSON.stringify(newAllTasksData));
  }

  backendTasksColumnOrder() {
    this.backendOrderTodo();
    this.backendOrderInprogress();
    this.backendOrderAwaitfeedback();
    this.backendOrderDone();
    console.log('backend', this.allTasksData);
    // this.backendService.updateItem(this.allTasksData, "tasks/bulk-update").subscribe(
    //   (response) => {
    //     console.log("Task updated successfully:", response);
    //     // this.backendUserDataService.lastUserAdded = response;
    //     // this.backendUserDataService.lastUserAddedId = response.id.toString();
    //     // this.backendUserDataService.userAddedSuccessfully = true;
    //   },
    //   (error) => {
    //     console.error("Error updating user:", error);
    //   }
    // );
    const updatedPositions = [
      ...this.todo.map((task) => ({ id: task.id, position: task.position })),
      ...this.inprogress.map((task) => ({ id: task.id, position: task.position })),
      ...this.awaitfeedback.map((task) => ({ id: task.id, position: task.position })),
      ...this.done.map((task) => ({ id: task.id, position: task.position })),
    ];
  
    // HTTP-Request an das Backend senden
    this.backendService.updateTaskPositionsBatch(updatedPositions).subscribe(
      (response) => {
        console.log("Positions updated successfully:", response);
      },
      (error) => {
        console.error("Error updating positions:", error);
      }
    );
  }

  backendOrderTodo() {
    // for (let index = 0; index < this.todo.length; index++) {
    //   const element = this.todo[index];
    //   this.firestore
    //     .collection('tasks')
    //     .doc(element.firebaseId)
    //     .update(element);
    // }
  }

  backendOrderInprogress() {
    // for (let index = 0; index < this.inprogress.length; index++) {
    //   const element = this.inprogress[index];
    //   this.firestore
    //     .collection('tasks')
    //     .doc(element.firebaseId)
    //     .update(element);
    // }
  }

  backendOrderAwaitfeedback() {
    // for (let index = 0; index < this.awaitfeedback.length; index++) {
    //   const element = this.awaitfeedback[index];
    //   this.firestore
    //     .collection('tasks')
    //     .doc(element.firebaseId)
    //     .update(element);
    // }
  }

  backendOrderDone() {
    // for (let index = 0; index < this.done.length; index++) {
    //   const element = this.done[index];
    //   this.firestore
    //     .collection('tasks')
    //     .doc(element.firebaseId)
    //     .update(element);
    // }
  }

  openTaskDetails(taskData) {
    const dialogRef = this.dialog.open(MainDialogTaskDetailsAndEditComponent, {
      panelClass: "popup__task__details",
      autoFocus: false,
    });
    dialogRef.componentInstance.taskData = { ...taskData };
    dialogRef.afterClosed().subscribe((result) => {
      this.taskDetailsClosed();
      this.getTasksData();
    });
  }

  taskDetailsClosed() {
    this.resetSearchFunction();
    if (this.boardCommService.subTaskCompletedChange) {
      // this.updateSingleTaskVar();
      this.setNewTasksDataToLocal();
      this.updateSingleTaskBackend();
      this.boardCommService.subTaskCompletedChange = false;
    }
  }

  // updateSingleTaskVar() {
  //   const updatedTaskData = this.boardCommService.updatedTaskData;
  //   for (let index = 0; index < this.allTasksData.length; index++) {
  //     const element = this.allTasksData[index];
  //     if (element.firebaseId === updatedTaskData.firebaseId) {
  //       this.allTasksData[index] = updatedTaskData;
  //     }
  //   }
  //   localStorage.removeItem('allTasksData');
  //   localStorage.setItem('allTasksData', JSON.stringify(this.allTasksData));
  // }

  updateSingleTaskBackend() {
    // const updatedTaskData = this.boardCommService.updatedTaskData;
    // this.firestore
    //   .collection('tasks')
    //   .doc(updatedTaskData.firebaseId)
    //   .update(updatedTaskData);
  }

  deleteTask() {
    this.displayDeletionSuccessfulAnimation();
    this.deleteSingleTaskBackend();
  }

  async deleteSingleTaskBackend() {
    // for (let index = 0; index < this.allTasksData.length; index++) {
    //   const element = this.allTasksData[index];
    //   if (element.firebaseId === this.boardCommService.taskToDelete.firebaseId) {
    //     this.allTasksData.splice(index, 1);
    //     try {
    //       await this.firestore.collection('tasks').doc(element.firebaseId).delete();
    //       this.reloadAfterNewTask();
    //       this.setNewTasksDataToLocal();
    //     } catch { console.error("Error deleting document: ", Error); }
    //   }
    // }
  }

  displayDeletionSuccessfulAnimation() {
    this.displayDeletionAnimation = true;
    setTimeout(() => {
      this.displayDeletionAnimation = false;
    }, 1500);
  }

  limitUsers(users: any[], limit: number): any[] {
    return users.slice(0, limit);
  }
}
