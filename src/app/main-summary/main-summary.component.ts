import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-summary',
  templateUrl: './main-summary.component.html',
  styleUrls: ['./main-summary.component.scss']
})
export class MainSummaryComponent implements OnInit {

  currentUserData;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if (this.userService.allUsersData !== undefined) {
      this.currentUserData = this.userService.currentUserData[0];
      console.log("this.currentUserData", this.currentUserData);
    } else { this.currentUserData = JSON.parse(localStorage.getItem('currentUserData') || '[]'); }
  }

}
