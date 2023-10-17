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

  currentlyDisplayed: string = 'contacts';
  currentlyClicked: string = 'contacts';

  displayMainSection(condition: 'summary' | 'board' | 'addTask' | 'contacts') {
    this.currentlyDisplayed = condition;
    this.currentlyClicked = condition;
  }

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUsersDataMain();
    this.getContactsDataMain();
    setTimeout(() => {
      this.showGreetingScreenMobile = false;
    }, 2500);
  }

  getUsersDataMain() {
    if (this.userService.allUsersData !== undefined) {
      this.currentUserData = this.userService.currentUserData[0];
      this.allUsersData = this.userService.allUsersData;
    } else {
      this.currentUserData = JSON.parse(localStorage.getItem('currentUserData') || '[]');
      this.allUsersData = JSON.parse(localStorage.getItem('allUsersData') || '[]');
    }
    this.sortUsersData();
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

  getContactsDataMain() {
    if (this.userService.allContactsData !== undefined) {
      this.allContactsData = this.userService.allContactsData;
    } else {
      this.allContactsData = JSON.parse(localStorage.getItem('allContactsData') || '[]');
    }

    console.log("allContactsData", this.allContactsData)
    this.sortContactsData();
  }

  sortContactsData() {
    this.allContactsData.sort((a, b) => {
      if (a.contactFirstName.toLowerCase() < b.contactFirstName.toLowerCase()) {
        return -1;
      }
      if (a.contactFirstName.toLowerCase() > b.contactFirstName.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    console.log("sorted allContactsData", this.allContactsData)
  }
}
