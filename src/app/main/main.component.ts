import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-data.service';
import { MainCommunicationService } from '../services/main-communication.service';
import { TaskDataService } from '../services/task-data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  showGreetingScreenMobile = true;
  currentUserData;
  allUsersData;
  allContactsData;
  allTasksData;

  currentlyDisplayed: string = 'help';
  currentlyClicked: string = 'default';

  displayMainSection(condition: 'summary' | 'board' | 'addTask' | 'contacts') {
    this.currentlyDisplayed = condition;
    this.currentlyClicked = condition;
  }

  constructor(
    private userService: UserService,
    private mainCommService: MainCommunicationService,
    public taskDataService: TaskDataService
  ) {
    this.mainCommService.displayBoardObservable.subscribe((section) => {
      if  (section !== 'default') {
        this.displayMainSection('board');
      }
    });
  }

  ngOnInit(): void {
    this.userService.getUsersDataMain();
    // this.userService.getContactsDataMain();
    this.taskDataService.getTasksDataMain();
    // this.userService.mergeUsersAndContactsData();
    // this.userService.generateUsersAndContactsLists();
    setTimeout(() => {
      this.showGreetingScreenMobile = false;
    }, 2500);
  }

  
}
