import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
    private firestore: AngularFirestore,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    if (!this.userService.currentUserData.length) {
      console.log("this.userService.currentUserData ist leer");
      this.userService.setAllUsersDataToVar();
      this.identifyCurrentUserData();
    }
    this.currentUserData = this.userService.currentUserData;
    console.log("header this.currentUserData", this.currentUserData);
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
