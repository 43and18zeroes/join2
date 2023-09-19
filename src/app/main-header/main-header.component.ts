import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GlobalStorageService } from '../services/global-storage.service';
import { getAuth, signOut } from "firebase/auth";
import { Router } from '@angular/router';
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  // currentUserAuth;
  // allUsersData;
  // currentUserData = [];
  // currentUserName;
  currentUserData;

  constructor(
    private firestore: AngularFirestore,
    private globalStorage: GlobalStorageService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    // this.getData();
    // this.getUsersDataSessionCache();
    this.currentUserData = JSON.parse(localStorage.getItem('currentUserData') || '[]');
    console.log("this.currentUserData", this.currentUserData);
  }

  // getUsersDataSessionCache() {
  //   this.allUsersData = this.globalStorage.allUsersData;
  //   this.currentUserAuth = this.globalStorage.currentUserAuth;
  //   this.currentUserData = this.globalStorage.currentUserData;
  //   this.currentUserName = this.globalStorage.currentUserName;

  //   console.log("this.allUsersData", this.allUsersData);
  //   console.log("this.currentUserAuth", this.currentUserAuth);
  //   console.log("this.currentUserData", this.currentUserData);
  //   console.log("this.currentUserName", this.currentUserName);
  // }

  // async getData() {
    // await this.getCurrentUserAuth();
    // this.userService.setAllUsersDataToLocalStorage();
    // this.getAllUsersDataFromLocalStorage();

    // this.filterCurrentUserData();
  // }

  // getAllUsersDataFromLocalStorage() {
  //   this.allUsersData = JSON.parse(localStorage.getItem('users') || '[]');
  // }

  // getCurrentUserAuth(): Promise<void> {
  //   const auth = getAuth();
  //   return new Promise((resolve, reject) => {
  //     auth.onAuthStateChanged((user) => {
  //       if (user != null) {
  //         this.currentUserAuth = user;
  //         resolve();
  //       } else {
  //         resolve();
  //       }
  //     });
  //   });
  // }

  // filterCurrentUserData() {
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
