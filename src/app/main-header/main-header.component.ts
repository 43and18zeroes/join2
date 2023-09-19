import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { getAuth, signOut } from "firebase/auth";
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  currentUserAuth;
  // allUsersData;
  currentUserData = [];
  currentUserName;

  constructor(private firestore: AngularFirestore,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData() {
    await this.getCurrentUserAuth();
    // this.userService.setAllUsersDataToLocalStorage();
    // this.getAllUsersDataFromLocalStorage();

    // this.getCurrentUserData();
  }

  // getAllUsersDataFromLocalStorage() {
  //   this.allUsersData = JSON.parse(localStorage.getItem('users') || '[]');
  // }

  getCurrentUserAuth(): Promise<void> {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        if (user != null) {
          this.currentUserAuth = user;
          resolve();
        } else {
          resolve();
        }
      });
    });
  }

  // getCurrentUserData() {
  //   for (const key in this.allUsersData) {
  //     if (this.allUsersData[key].userEmailAddress === this.currentUserAuth.email) {
  //       this.currentUserData.push(this.allUsersData[key]);
  //     }
  //   }
  //   this.currentUserName = this.currentUserData[0].userName;
  // }

  logOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigateByUrl('/');
    }).catch((error) => {
    });
  }
}
