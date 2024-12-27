import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../main/main.component';
import { UserService } from '../services/user-data.service';
import { TaskDataService } from '../services/task-data.service';
import { BackendService } from '../services/drf/backend-service.service';
import { BackendUserDataService } from '../services/drf/backend-user-data.service';

@Component({
  selector: 'app-main-summary',
  templateUrl: './main-summary.component.html',
  styleUrls: ['./main-summary.component.scss']
})
export class MainSummaryComponent implements OnInit {

  userData: any = null;
  allUsersData;
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
    private backendUserDataService: BackendUserDataService,
    public mainComponent: MainComponent,
    public taskDataService: TaskDataService,
    private userService: UserService,
    private backendService: BackendService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.showGreetingScreenMobile = this.mainComponent.showGreetingScreenMobile;
    this.currentUserData = this.userService.currentUserData;
    // if (this.currentUserData.userName !== "Gast") {
    //   this.currenUserIsGuest = false;
    // }

    // this.allTasksData = this.taskDataService.allTasksData;
    
  }

  getData() {
    this.backendUserDataService.getUserDataObservable().subscribe((data) => {
      this.userData = data;
      // if (this.userData) {
      //   console.log('this.userData:', this.userData);
      // }
    });
    this.backendService.getTasks().subscribe(data => {
      this.allTasksData = data;
      this.determineMainNumbers();
    });
    this.backendUserDataService.getUsers().subscribe(data => {
      this.allUsersData = data;
    });
  }

  determineMainNumbers() {
    this.amountTodo = this.allTasksData.filter(item => item.status === 'todo').length;
    this.amountDone = this.allTasksData.filter(item => item.status === 'done').length;
    this.amountUrgent = this.allTasksData.filter(item => item.priority === 'urgent').length;
    this.findUpcomingDeadline();
    this.amountTasks = this.allTasksData.length;
    this.amountInProgress = this.allTasksData.filter(item => item.taskStatus === 'inprogress').length;
    this.amountAwaitFeedback = this.allTasksData.filter(item => item.taskStatus === 'awaitfeedback').length;
  }

  findUpcomingDeadline() {
    const today = new Date();
    let closestDiff = Number.MAX_VALUE;
    this.allTasksData.forEach(task => {
      const dueDate = new Date(task.due_date);
      const diff = (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      if (diff >= 0 && diff < closestDiff) {
        closestDiff = diff;
        this.upcomingDeadline = task.due_date;
      }
    });
  }

  displayBoard() {
    this.mainComponent.currentlyDisplayed = 'board';
    this.mainComponent.currentlyClicked = 'board';
  }

  getGreeting(): string {
    const currentHour = new Date().getHours();
  
    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning!";
    } else if (currentHour >= 12 && currentHour < 18) {
      return `Good afternoon!`;
    } else if (currentHour >= 18 && currentHour < 22) {
      return "Good evening!";
    } else {
      return "Good night!";
    }
  }  
}
