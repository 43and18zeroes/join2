import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
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
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.allTasksData = this.userService.allTasksData;
    console.log("this.allTasksData", this.allTasksData);
    this.convertDataToLists();
  }

  ngAfterViewInit() {
    this.checkForHorizontalScroll();
  }

  convertDataToLists() {
    for (let index = 0; index < this.allTasksData.length; index++) {
      const element = this.allTasksData[index];
      if (element.taskStatus === "todo") {
        this.todo.push(element);
      }
    }
  }

  private checkForHorizontalScroll() {
    const mainElement: HTMLDivElement = this.mainContainer.nativeElement;
    this.sectionBodys.forEach((sectionBody: ElementRef) => {
      const divElement: HTMLDivElement = sectionBody.nativeElement;
      if (mainElement.scrollWidth > mainElement.clientWidth) {
        divElement.classList.add('has__horizontal__scroll');
      }
      else {
        divElement.classList.remove('has__horizontal__scroll');
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.updateTaskStatus();
    this.newAllTasksData = [...this.todo, ...this.inprogress];
  }

  updateTaskStatus() {
    for (let index = 0; index < this.todo.length; index++) {
      const element = this.todo[index];
      element.taskStatus = "todo";
    }
    for (let index = 0; index < this.inprogress.length; index++) {
      const element = this.inprogress[index];
      element.taskStatus = "inprogress";
    }
  }
}
