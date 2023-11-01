import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../services/user-data.service';

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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkForHorizontalScroll();
  }

  @ViewChild('mainContainer') mainContainer: ElementRef;
  @ViewChildren('sectionBody') sectionBodys: QueryList<ElementRef>;

  constructor(
    private firestore: AngularFirestore,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.allTasksData = this.userService.allTasksData;
    this.convertTasksDataToLists();
  }

  ngAfterViewInit() {
    this.checkForHorizontalScroll();
  }

  convertTasksDataToLists() {
    this.convertTodoToList();
    this.convertInprogressToList();
  }

  convertTodoToList() {
    for (let index = 0; index < this.allTasksData.length; index++) {
      const element = this.allTasksData[index];
      if (element.taskStatus === "todo") {
        this.todo.push(element);
      }
    }
  }

  convertInprogressToList() {
    for (let index = 0; index < this.allTasksData.length; index++) {
      const element = this.allTasksData[index];
      if (element.taskStatus === "inprogress") {
        this.inprogress.push(element);
      }
    }
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
    this.updateTaskStatus();
    this.newAllTasksData = [...this.todo, ...this.inprogress];
    this.overwriteAllTasksDataBackend(this.newAllTasksData);
  }

  updateTaskStatus() {
    for (let index = 0; index < this.todo.length; index++) {
      this.todo[index].taskStatus = "todo";
    }
    for (let index = 0; index < this.inprogress.length; index++) {
      this.inprogress[index].taskStatus = "inprogress";
    }
  }

  overwriteAllTasksDataBackend(newAllTasksData) {
    const tasksCollection = this.firestore.collection('tasks');
  
  // 1. Alle bestehenden Dokumente löschen
  tasksCollection.get().toPromise().then(querySnapshot => {
    const batch = this.firestore.firestore.batch();
    querySnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // 2. Neue Aufgaben hinzufügen
    newAllTasksData.forEach(task => {
      const docRef = tasksCollection.ref.doc(); // Neue ID für jedes Dokument erstellen
      batch.set(docRef, task);
    });

    // 3. Batch ausführen
    return batch.commit();
  }).then(() => {
    console.log('All tasks overwritten successfully');
  }).catch(err => {
    console.error('Error overwriting tasks: ', err);
  });
  }
}
