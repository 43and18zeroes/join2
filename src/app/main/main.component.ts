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

  currentlyDisplayed: string = 'summary';
  currentlyClicked: string = 'summary';

  displayMainSection(condition: 'summary' | 'addTask' | 'board' | 'contacts') {
    this.currentlyDisplayed = condition;
    this.currentlyClicked = condition;
  }

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if (this.userService.allUsersData !== undefined) {
      this.currentUserData = this.userService.currentUserData[0];
    } else {
      this.currentUserData = JSON.parse(localStorage.getItem('currentUserData') || '[]');
    }
    setTimeout(() => {
      this.showGreetingScreenMobile = false;
    }, 2500);
  }

}
