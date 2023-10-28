import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-data.service';

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

  currentlyDisplayed: string = 'board';
  currentlyClicked: string = 'board';

  displayMainSection(condition: 'summary' | 'board' | 'addTask' | 'contacts') {
    this.currentlyDisplayed = condition;
    this.currentlyClicked = condition;
  }

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsersDataMain();
    // this.userService.getContactsDataMain();
    this.userService.getTasksDataMain();
    // this.userService.mergeUsersAndContactsData();
    // this.userService.generateUsersAndContactsLists();
    setTimeout(() => {
      this.showGreetingScreenMobile = false;
    }, 2500);
  }

}
