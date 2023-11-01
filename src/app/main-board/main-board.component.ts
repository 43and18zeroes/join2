import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../services/user-data.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-main-board',
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss']
})
export class MainBoardComponent {

  allTasksData;
  newAllTasksData;

  todo = [];
  inprogress = [];
  awaitfeedback = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  subTasksComplete;
  subTasksAmount;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkForHorizontalScroll();
  }

  @ViewChild('mainContainer') mainContainer: ElementRef;
  @ViewChildren('sectionBody') sectionBodys: QueryList<ElementRef>;

  constructor(
    private firestore: AngularFirestore,
    private userService: UserService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && event.id === 1) {
        this.onBrowserRefresh();
      }
    });
  }

  ngOnInit(): void {
    this.allTasksData = this.userService.allTasksData;
    console.log("allTasksData", this.allTasksData)
    this.convertTasksDataToLists();
    this.sortTasksInColumns();
  }

  onBrowserRefresh() {
    this.allTasksData = JSON.parse(localStorage.getItem('allTasksData') || '[]');
  }

  ngAfterViewInit() {
    this.checkForHorizontalScroll();
  }

  convertTasksDataToLists() {
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
      if (a.taskColumnOrdner === undefined) return -1;
      if (b.taskColumnOrdner === undefined) return 1;
      return a.taskColumnOrdner - b.taskColumnOrdner;
    };

    this.todo.sort(customSort);
    this.inprogress.sort(customSort);
  }

  countSubtasksCompleted(obj: any): number {
    return Object.values(obj).filter(value => value === 'true').length;
  }

  private checkForHorizontalScroll() {
    const mainElement: HTMLDivElement = this.mainContainer.nativeElement;
    this.sectionBodys.forEach((sectionBody: ElementRef) => {
      const divElement: HTMLDivElement = sectionBody.nativeElement;
      if (mainElement.scrollWidth > mainElement.clientWidth) divElement.classList.add('has__horizontal__scroll');
      else divElement.classList.remove('has__horizontal__scroll');
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    else transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    this.saveBoardStatus();
  }

  saveBoardStatus() {
    this.updateTasksStatus();
    this.newAllTasksData = [...this.todo, ...this.inprogress];
    this.setNewTasksDataToLocal(this.newAllTasksData);
    this.overwriteAllTasksDataBackend(this.newAllTasksData);
  }

  updateTasksStatus() {
    this.updateStatusForList(this.todo, "todo");
    this.updateStatusForList(this.inprogress, "inprogress");
  }

  updateStatusForList(list, status) {
    let taskColumnOrdner = 0;
    list.forEach(task => {
      task.taskStatus = status;
      task.taskColumnOrdner = taskColumnOrdner;
      taskColumnOrdner++;
    });
  }

  setNewTasksDataToLocal(newAllTasksData) {
    localStorage.removeItem('allTasksData');
    localStorage.setItem('allTasksData', JSON.stringify(newAllTasksData));
  }

  overwriteAllTasksDataBackend(newAllTasksData) {
    const tasksCollection = this.firestore.collection('tasks');

    // Delete tasks collection backend
    tasksCollection.get().toPromise().then(querySnapshot => {
      const batch = this.firestore.firestore.batch();
      querySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Add new tasks
      newAllTasksData.forEach(task => {
        const docRef = tasksCollection.ref.doc(); // Neue ID für jedes Dokument erstellen
        batch.set(docRef, task);
      });

      // Execute
      return batch.commit();
    }).then(() => {
      console.log('All tasks overwritten successfully');
    }).catch(err => {
      console.error('Error overwriting tasks: ', err);
    });
  }
}
