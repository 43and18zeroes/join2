import { Component, OnInit } from '@angular/core';
import { getAuth, signOut } from "firebase/auth";
import { Router } from '@angular/router';
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  currentUserData;

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    if (this.userService.allUsersData !== undefined) {
      this.currentUserData = this.userService.currentUserData[0];
      console.log("this.currentUserData", this.currentUserData);
    } else {
      this.currentUserData = JSON.parse(localStorage.getItem('currentUserData') || '[]');
    }
  }

  async identifyCurrentUserData() {
    await this.userService.getCurrentUserAuth();
    this.userService.filterCurrentUserData();
  }

  logOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigateByUrl('/');
    }).catch((error) => {
    });
  }
}
