import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../main/main.component';
import { UserService } from '../services/user-data.service';
import { TaskDataService } from '../services/task-data.service';
import { BackendTempService } from '../services/backend-temp.service';
import { BackendService } from '../services/backend-service.service';

@Component({
  selector: 'app-main-summary',
  templateUrl: './main-summary.component.html',
  styleUrls: ['./main-summary.component.scss']
})
export class MainSummaryComponent implements OnInit {

  showGreetingScreenMobile = true;
  currenUserIsGuest = true;
  currentUserData;
  allTasksData;
  amountTodo;
  amountDone;
  amountUrgent;
  upcomingDeadline;
  amountTasks;
  amountInProgress;
  amountAwaitFeedback;
  items: any[] = [];

  constructor(
    public mainComponent: MainComponent,
    public taskDataService: TaskDataService,
    private userService: UserService,
    private backendTempService: BackendTempService,
    private backendService: BackendService
  ) { }

  ngOnInit(): void {
    this.backendService.getItems().subscribe(data => {
      this.allTasksData = data;
      console.log('this.allTasksData', this.allTasksData);
      this.determineMainNumbers();
    });
    // this.backendTempService.items$.subscribe(items => {
    //   this.allTasksData = items; // Daten aus dem Service abonnieren
    //   console.log('this.allTasksData', this.allTasksData);
    // });
    this.showGreetingScreenMobile = this.mainComponent.showGreetingScreenMobile;
    this.currentUserData = this.userService.currentUserData;
    if (this.currentUserData.userName !== "Gast") {
      this.currenUserIsGuest = false;
    }

    // this.allTasksData = this.taskDataService.allTasksData;
    
  }

  determineMainNumbers() {
    this.amountTodo = this.allTasksData.filter(item => item.status === 'todo').length;
    // this.amountDone = this.allTasksData.filter(item => item.taskStatus === 'done').length;
    // this.amountUrgent = this.allTasksData.filter(item => item.priority === 'urgent').length;
    // this.findUpcomingDeadline()
    // this.amountTasks = this.allTasksData.length;
    // this.amountInProgress = this.allTasksData.filter(item => item.taskStatus === 'inprogress').length;
    // this.amountAwaitFeedback = this.allTasksData.filter(item => item.taskStatus === 'awaitfeedback').length;
  }

  findUpcomingDeadline() {
    const today = new Date();
    let closestDiff = Number.MAX_VALUE;
    this.allTasksData.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const diff = (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      if (diff >= 0 && diff < closestDiff) {
        closestDiff = diff;
        this.upcomingDeadline = task.dueDate;
      }
    });
  }

  displayBoard() {
    this.mainComponent.currentlyDisplayed = 'board';
    this.mainComponent.currentlyClicked = 'board';
  }
}
