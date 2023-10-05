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

  currentlyDisplayed: string = 'addTask';
  currentlyClicked: string = 'addTask';

  displayMainSection(condition: 'summary' | 'board' | 'addTask' | 'contacts') {
    this.currentlyDisplayed = condition;
    this.currentlyClicked = condition;
  }

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if (this.userService.allUsersData !== undefined) {
      this.currentUserData = this.userService.currentUserData[0];
      this.allUsersData = this.userService.allUsersData;
    } else {
      this.currentUserData = JSON.parse(localStorage.getItem('currentUserData') || '[]');
      this.allUsersData = JSON.parse(localStorage.getItem('allUsersData') || '[]');
    }
    this.sortUsersData();
    setTimeout(() => {
      this.showGreetingScreenMobile = false;
    }, 2500);
  }

  private sortUsersData(): void {
    this.allUsersData.sort((a, b) => {
      if (a.userFirstName.toLowerCase() < b.userFirstName.toLowerCase()) {
        return -1;
      }
      if (a.userFirstName.toLowerCase() > b.userFirstName.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }
}
