import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../main/main.component';
// import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-summary',
  templateUrl: './main-summary.component.html',
  styleUrls: ['./main-summary.component.scss']
})
export class MainSummaryComponent implements OnInit {

  currentUserData;

  constructor(public mainComponent: MainComponent) { }

  ngOnInit(): void {
    this.currentUserData = this.mainComponent.currentUserData;
    // if (this.userService.allUsersData !== undefined) {
    //   this.currentUserData = this.userService.currentUserData[0];
    //   console.log("this.currentUserData", this.currentUserData);
    // } else {
    //   this.currentUserData = JSON.parse(localStorage.getItem('currentUserData') || '[]');
    // }
  }

}
